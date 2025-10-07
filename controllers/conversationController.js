import {
  Conversation,
  Message,
  User,
  ConversationParticipant,
  MessageStatus,
} from '../models/index.js';
import { Op } from 'sequelize';

// Get or create conversation
export const getOrCreateConversation = async (req, res) => {
  const { participant_id } = req.body;
  const user_id = req.user.id;

  try {
    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { user_one_id: user_id, user_two_id: participant_id },
          { user_one_id: participant_id, user_two_id: user_id },
        ],
      },
      include: [
        { model: User, as: 'userOne', attributes: ['id', 'username', 'full_name', 'profile_picture'] },
        { model: User, as: 'userTwo', attributes: ['id', 'username', 'full_name', 'profile_picture'] },
        { model: Message, as: 'lastMessage' },
      ],
    });

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        user_one_id: user_id,
        user_two_id: participant_id,
      });

      // Create participant records
      await ConversationParticipant.bulkCreate([
        {
          conversation_id: conversation.id,
          user_id: user_id,
          joined_at: new Date(),
        },
        {
          conversation_id: conversation.id,
          user_id: participant_id,
          joined_at: new Date(),
        },
      ]);

      conversation = await Conversation.findByPk(conversation.id, {
        include: [
          { model: User, as: 'userOne', attributes: ['id', 'username', 'full_name', 'profile_picture'] },
          { model: User, as: 'userTwo', attributes: ['id', 'username', 'full_name', 'profile_picture'] },
        ],
      });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    console.error('Get/Create Conversation Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get or create conversation' });
  }
};

// Get all conversations for a user
export const getUserConversations = async (req, res) => {
  const user_id = req.user.id;

  try {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ user_one_id: user_id }, { user_two_id: user_id }],
      },
      include: [
        {
          model: User,
          as: 'userOne',
          attributes: ['id', 'username', 'full_name', 'profile_picture', 'is_online', 'last_seen_at'],
        },
        {
          model: User,
          as: 'userTwo',
          attributes: ['id', 'username', 'full_name', 'profile_picture', 'is_online', 'last_seen_at'],
        },
        {
          model: Message,
          as: 'lastMessage',
          attributes: ['id', 'message_text', 'message_type', 'created_at'],
        },
        {
          model: ConversationParticipant,
          as: 'participants',
          where: { user_id },
          required: false,
        },
      ],
      order: [['last_message_at', 'DESC']],
    });

    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Get Conversations Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get conversations' });
  }
};

// Get conversation by ID
export const getConversationById = async (req, res) => {
  const { conversation_id } = req.params;
  const user_id = req.user.id;

  try {
    const conversation = await Conversation.findOne({
      where: {
        id: conversation_id,
        [Op.or]: [{ user_one_id: user_id }, { user_two_id: user_id }],
      },
      include: [
        {
          model: User,
          as: 'userOne',
          attributes: ['id', 'username', 'full_name', 'profile_picture', 'is_online', 'last_seen_at'],
        },
        {
          model: User,
          as: 'userTwo',
          attributes: ['id', 'username', 'full_name', 'profile_picture', 'is_online', 'last_seen_at'],
        },
      ],
    });

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    console.error('Get Conversation Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get conversation' });
  }
};

// Delete conversation
export const deleteConversation = async (req, res) => {
  const { conversation_id } = req.params;
  const user_id = req.user.id;

  try {
    const conversation = await Conversation.findOne({
      where: {
        id: conversation_id,
        [Op.or]: [{ user_one_id: user_id }, { user_two_id: user_id }],
      },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    // Soft delete messages in the conversation
    await Message.update(
      { is_deleted: true, deleted_at: new Date() },
      { where: { conversation_id } }
    );

    res.json({ success: true, message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete Conversation Error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete conversation' });
  }
};

// Archive conversation
export const archiveConversation = async (req, res) => {
  const { conversation_id } = req.params;
  const user_id = req.user.id;

  try {
    const participant = await ConversationParticipant.findOne({
      where: { conversation_id, user_id },
    });

    if (!participant) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    participant.is_archived = true;
    await participant.save();

    res.json({ success: true, message: 'Conversation archived successfully' });
  } catch (error) {
    console.error('Archive Conversation Error:', error);
    res.status(500).json({ success: false, error: 'Failed to archive conversation' });
  }
};

// Mute conversation
export const muteConversation = async (req, res) => {
  const { conversation_id } = req.params;
  const { is_muted } = req.body;
  const user_id = req.user.id;

  try {
    const participant = await ConversationParticipant.findOne({
      where: { conversation_id, user_id },
    });

    if (!participant) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    participant.is_muted = is_muted;
    await participant.save();

    res.json({
      success: true,
      message: `Conversation ${is_muted ? 'muted' : 'unmuted'} successfully`,
    });
  } catch (error) {
    console.error('Mute Conversation Error:', error);
    res.status(500).json({ success: false, error: 'Failed to mute conversation' });
  }
};
