import { Message } from '../models/Message.js';

// Get chat history
export const getChatHistory = async (req, res) => {
  const { userId } = req.params;
  const { currentUserId } = req.body;
  try {
    const messages = await Message.findAll({
      where: {
        sender_id: [userId, currentUserId],
        receiver_id: [userId, currentUserId],
      },
      order: [['timestamp', 'ASC']],
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  try {
    const message = await Message.create({ sender_id, receiver_id, content, status: 'sent', timestamp: new Date() });
    res.status(201).json({ message: 'Message sent successfully', message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Update user status
export const updateStatus = async (req, res) => {
  const { userId, online_status, last_seen } = req.body;
  try {
    await User.update({ online_status, last_seen }, { where: { id: userId } });
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};