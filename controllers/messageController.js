import {
  Message,
  Conversation,
  User,
  MessageStatus,
  ConversationParticipant,
} from '../models/index.js';
import { Op } from 'sequelize';

// Send a message
export const sendMessage = async (req, res) => {
  const { conversation_id, receiver_id, message_text, message_type, media_url, file_name, file_size } = req.body;
  const sender_id = req.user.id;

  try {
    // Validate required fields
    if (!conversation_id || !receiver_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'conversation_id and receiver_id are required' 
      });
    }

    // Verify conversation exists and user is part of it
    const conversation = await Conversation.findOne({
      where: {
        id: conversation_id,
        [Op.or]: [{ user_one_id: sender_id }, { user_two_id: sender_id }],
      },
    });

    if (!conversation) {
      return res.status(404).json({ 
        success: false, 
        error: `Conversation not found or you are not a participant. Your user ID: ${sender_id}` 
      });
    }

    // Verify receiver exists
    const receiver = await User.findByPk(receiver_id);
    if (!receiver) {
      return res.status(404).json({ 
        success: false, 
        error: `Receiver with ID ${receiver_id} not found` 
      });
    }

    // Verify receiver is part of conversation
    if (conversation.user_one_id !== receiver_id && conversation.user_two_id !== receiver_id) {
      return res.status(400).json({ 
        success: false, 
        error: `Receiver ID ${receiver_id} is not part of conversation ${conversation_id}` 
      });
    }

    // Create message
    const message = await Message.create({
      conversation_id,
      sender_id,
      receiver_id,
      message_text,
      message_type: message_type || 'text',
      media_url,
      file_name,
      file_size,
    });

    // Update conversation last message
    await Conversation.update(
      {
        last_message_id: message.id,
        last_message_at: new Date(),
      },
      { where: { id: conversation_id } }
    );

    // Create message status for receiver
    await MessageStatus.create({
      message_id: message.id,
      user_id: receiver_id,
      status: 'sent',
      sent_at: new Date(),
    });

    // Update unread count for receiver (only if ConversationParticipant exists)
    const participant = await ConversationParticipant.findOne({
      where: { conversation_id, user_id: receiver_id }
    });
    
    if (participant) {
      await ConversationParticipant.increment('unread_count', {
        where: { conversation_id, user_id: receiver_id },
      });
    }

    // Fetch complete message with relations
    const completeMessage = await Message.findByPk(message.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'full_name', 'profile_picture'] },
        { model: User, as: 'receiver', attributes: ['id', 'username', 'full_name', 'profile_picture'] },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: completeMessage,
    });
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message',
      details: error.message 
    });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  const { conversation_id } = req.params;
  const { limit = 50, offset = 0 } = req.query;
  const user_id = req.user.id;

  try {
    // Verify user is part of conversation
    const conversation = await Conversation.findOne({
      where: {
        id: conversation_id,
        [Op.or]: [{ user_one_id: user_id }, { user_two_id: user_id }],
      },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    // Get messages
    const messages = await Message.findAll({
      where: {
        conversation_id,
        is_deleted: false,
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'full_name', 'profile_picture'] },
        { model: MessageStatus, as: 'statuses' },
      ],
      order: [['created_at', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get messages' });
  }
};

// Update message status (delivered/read)
export const updateMessageStatus = async (req, res) => {
  const { message_id } = req.params;
  const { status } = req.body; // 'delivered' or 'read'
  const user_id = req.user.id;

  try {
    const messageStatus = await MessageStatus.findOne({
      where: { message_id, user_id },
    });

    if (!messageStatus) {
      return res.status(404).json({ success: false, error: 'Message status not found' });
    }

    messageStatus.status = status;
    if (status === 'delivered') {
      messageStatus.delivered_at = new Date();
    } else if (status === 'read') {
      messageStatus.read_at = new Date();
      
      // Update last read message and reset unread count
      const message = await Message.findByPk(message_id);
      await ConversationParticipant.update(
        {
          last_read_message_id: message_id,
          last_read_at: new Date(),
          unread_count: 0,
        },
        {
          where: {
            conversation_id: message.conversation_id,
            user_id,
          },
        }
      );
    }

    await messageStatus.save();

    res.json({
      success: true,
      message: 'Message status updated successfully',
      data: messageStatus,
    });
  } catch (error) {
    console.error('Update Message Status Error:', error);
    res.status(500).json({ success: false, error: 'Failed to update message status' });
  }
};

// Edit message
export const editMessage = async (req, res) => {
  const { message_id } = req.params;
  const { message_text } = req.body;
  const user_id = req.user.id;

  try {
    const message = await Message.findOne({
      where: { id: message_id, sender_id: user_id, is_deleted: false },
    });

    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    message.message_text = message_text;
    message.is_edited = true;
    await message.save();

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message,
    });
  } catch (error) {
    console.error('Edit Message Error:', error);
    res.status(500).json({ success: false, error: 'Failed to edit message' });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  const { message_id } = req.params;
  const user_id = req.user.id;

  try {
    const message = await Message.findOne({
      where: { id: message_id, sender_id: user_id },
    });

    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    message.is_deleted = true;
    message.deleted_at = new Date();
    await message.save();

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete Message Error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete message' });
  }
};

// Mark all messages as read in a conversation
export const markAllAsRead = async (req, res) => {
  const { conversation_id } = req.params;
  const user_id = req.user.id;

  try {
    // Get all unread messages in the conversation
    const messages = await Message.findAll({
      where: { conversation_id, receiver_id: user_id },
      include: [
        {
          model: MessageStatus,
          as: 'statuses',
          where: { user_id, status: { [Op.ne]: 'read' } },
        },
      ],
    });

    // Update all message statuses to read
    for (const message of messages) {
      await MessageStatus.update(
        { status: 'read', read_at: new Date() },
        { where: { message_id: message.id, user_id } }
      );
    }

    // Reset unread count
    await ConversationParticipant.update(
      { unread_count: 0, last_read_at: new Date() },
      { where: { conversation_id, user_id } }
    );

    res.json({ success: true, message: 'All messages marked as read' });
  } catch (error) {
    console.error('Mark All As Read Error:', error);
    res.status(500).json({ success: false, error: 'Failed to mark messages as read' });
  }
};