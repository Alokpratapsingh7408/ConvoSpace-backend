import { Notification } from '../models/index.js';

// Create notification
export const createNotification = async (req, res) => {
  const {
    user_id,
    notification_type,
    title,
    message,
    related_entity_type,
    related_entity_id,
  } = req.body;

  try {
    const notification = await Notification.create({
      user_id,
      notification_type,
      title,
      message,
      related_entity_type,
      related_entity_id,
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification,
    });
  } catch (error) {
    console.error('Create Notification Error:', error);
    res.status(500).json({ success: false, error: 'Failed to create notification' });
  }
};

// Get all notifications for user
export const getNotifications = async (req, res) => {
  const user_id = req.user.id;
  const { limit = 50, offset = 0 } = req.query;

  try {
    const notifications = await Notification.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const unreadCount = await Notification.count({
      where: { user_id, is_read: false },
    });

    res.json({
      success: true,
      data: {
        notifications,
        unread_count: unreadCount,
      },
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get notifications' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  const { notification_id } = req.params;
  const user_id = req.user.id;

  try {
    const notification = await Notification.findOne({
      where: { id: notification_id, user_id },
    });

    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    notification.is_read = true;
    notification.read_at = new Date();
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    console.error('Mark Notification As Read Error:', error);
    res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  const user_id = req.user.id;

  try {
    await Notification.update(
      { is_read: true, read_at: new Date() },
      { where: { user_id, is_read: false } }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark All Notifications As Read Error:', error);
    res.status(500).json({ success: false, error: 'Failed to mark all notifications as read' });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  const { notification_id } = req.params;
  const user_id = req.user.id;

  try {
    const deleted = await Notification.destroy({
      where: { id: notification_id, user_id },
    });

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete notification' });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  const user_id = req.user.id;

  try {
    const count = await Notification.count({
      where: { user_id, is_read: false },
    });

    res.json({ success: true, data: { unread_count: count } });
  } catch (error) {
    console.error('Get Unread Count Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get unread count' });
  }
};
