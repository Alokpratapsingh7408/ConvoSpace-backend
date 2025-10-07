import jwt from 'jsonwebtoken';
import {
  User,
  Message,
  MessageStatus,
  Conversation,
  ConversationParticipant,
  TypingIndicator,
} from '../models/index.js';

// Store active user connections
const activeUsers = new Map(); // userId -> socketId

export const initSocket = (io) => {
  // Socket.io middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.phoneNumber = decoded.phone_number;

      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    console.log(`✅ User connected: ${userId} (Socket: ${socket.id})`);

    // Store active user connection
    activeUsers.set(userId, socket.id);

    // Update user online status
    await User.update(
      { is_online: true },
      { where: { id: userId } }
    );

    // Notify user's contacts that they are online
    socket.broadcast.emit('user:online', { userId });

    // Join user to their personal room
    socket.join(`user:${userId}`);

    // ============================================
    // MESSAGE EVENTS
    // ============================================

    // Send message
    socket.on('message:send', async (data) => {
      try {
        const { conversation_id, receiver_id, message_text, message_type, media_url } = data;

        // Create message
        const message = await Message.create({
          conversation_id,
          sender_id: userId,
          receiver_id,
          message_text,
          message_type: message_type || 'text',
          media_url,
        });

        // Update conversation
        await Conversation.update(
          {
            last_message_id: message.id,
            last_message_at: new Date(),
          },
          { where: { id: conversation_id } }
        );

        // Create message status
        await MessageStatus.create({
          message_id: message.id,
          user_id: receiver_id,
          status: 'sent',
          sent_at: new Date(),
        });

        // Update unread count
        await ConversationParticipant.increment('unread_count', {
          where: { conversation_id, user_id: receiver_id },
        });

        // Get complete message with relations
        const completeMessage = await Message.findByPk(message.id, {
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'username', 'full_name', 'profile_picture'],
            },
          ],
        });

        // Send to receiver if online
        const receiverSocketId = activeUsers.get(receiver_id);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('message:receive', completeMessage);
          
          // Auto-update to delivered status
          await MessageStatus.update(
            {
              status: 'delivered',
              delivered_at: new Date(),
            },
            { where: { message_id: message.id, user_id: receiver_id } }
          );

          // Notify sender that message was delivered
          socket.emit('message:delivered', {
            message_id: message.id,
            delivered_at: new Date(),
          });
        }

        // Confirm to sender
        socket.emit('message:sent', completeMessage);
      } catch (error) {
        console.error('Send Message Error:', error);
        socket.emit('message:error', { error: 'Failed to send message' });
      }
    });

    // Mark message as read
    socket.on('message:read', async (data) => {
      try {
        const { message_id, conversation_id } = data;

        // Update message status
        await MessageStatus.update(
          {
            status: 'read',
            read_at: new Date(),
          },
          { where: { message_id, user_id: userId } }
        );

        // Update conversation participant
        await ConversationParticipant.update(
          {
            last_read_message_id: message_id,
            last_read_at: new Date(),
            unread_count: 0,
          },
          { where: { conversation_id, user_id: userId } }
        );

        // Get message to find sender
        const message = await Message.findByPk(message_id);

        // Notify sender
        const senderSocketId = activeUsers.get(message.sender_id);
        if (senderSocketId) {
          io.to(senderSocketId).emit('message:read', {
            message_id,
            read_by: userId,
            read_at: new Date(),
          });
        }
      } catch (error) {
        console.error('Mark Read Error:', error);
      }
    });

    // ============================================
    // TYPING INDICATOR EVENTS
    // ============================================

    socket.on('typing:start', async (data) => {
      try {
        const { conversation_id, receiver_id } = data;

        // Update typing indicator in database
        await TypingIndicator.upsert({
          conversation_id,
          user_id: userId,
          is_typing: true,
          started_at: new Date(),
        });

        // Notify receiver
        const receiverSocketId = activeUsers.get(receiver_id);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('typing:start', {
            conversation_id,
            user_id: userId,
          });
        }
      } catch (error) {
        console.error('Typing Start Error:', error);
      }
    });

    socket.on('typing:stop', async (data) => {
      try {
        const { conversation_id, receiver_id } = data;

        // Update typing indicator
        await TypingIndicator.update(
          { is_typing: false },
          { where: { conversation_id, user_id: userId } }
        );

        // Notify receiver
        const receiverSocketId = activeUsers.get(receiver_id);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('typing:stop', {
            conversation_id,
            user_id: userId,
          });
        }
      } catch (error) {
        console.error('Typing Stop Error:', error);
      }
    });

    // ============================================
    // PRESENCE EVENTS
    // ============================================

    socket.on('presence:update', async (data) => {
      try {
        const { is_online } = data;

        await User.update(
          {
            is_online,
            last_seen_at: is_online ? null : new Date(),
          },
          { where: { id: userId } }
        );

        // Broadcast to all users
        socket.broadcast.emit('presence:update', {
          user_id: userId,
          is_online,
          last_seen_at: is_online ? null : new Date(),
        });
      } catch (error) {
        console.error('Presence Update Error:', error);
      }
    });

    // ============================================
    // DISCONNECT
    // ============================================

    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${userId} (Socket: ${socket.id})`);

      // Remove from active users
      activeUsers.delete(userId);

      // Update user offline status
      await User.update(
        {
          is_online: false,
          last_seen_at: new Date(),
        },
        { where: { id: userId } }
      );

      // Notify contacts that user is offline
      socket.broadcast.emit('user:offline', {
        userId,
        last_seen_at: new Date(),
      });
    });
  });

  console.log('🔌 Socket.io initialized');
};