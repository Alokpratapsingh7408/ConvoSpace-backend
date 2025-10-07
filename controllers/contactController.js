import { UserContact, User } from '../models/index.js';
import { Op } from 'sequelize';

// Add contact
export const addContact = async (req, res) => {
  const { contact_user_id, contact_name } = req.body;
  const user_id = req.user.id;

  try {
    // Check if contact already exists
    const existingContact = await UserContact.findOne({
      where: { user_id, contact_user_id },
    });

    if (existingContact) {
      return res.status(400).json({
        success: false,
        error: 'Contact already exists',
      });
    }

    // Verify contact user exists
    const contactUser = await User.findByPk(contact_user_id);
    if (!contactUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const contact = await UserContact.create({
      user_id,
      contact_user_id,
      contact_name,
      added_at: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Contact added successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Add Contact Error:', error);
    res.status(500).json({ success: false, error: 'Failed to add contact' });
  }
};

// Get all contacts
export const getContacts = async (req, res) => {
  const user_id = req.user.id;

  try {
    const contacts = await UserContact.findAll({
      where: { user_id, is_blocked: false },
      include: [
        {
          model: User,
          as: 'contact',
          attributes: ['id', 'username', 'full_name', 'profile_picture', 'is_online', 'last_seen_at'],
        },
      ],
      order: [['added_at', 'DESC']],
    });

    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Get Contacts Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get contacts' });
  }
};

// Update contact
export const updateContact = async (req, res) => {
  const { contact_id } = req.params;
  const { contact_name, is_favorite } = req.body;
  const user_id = req.user.id;

  try {
    const contact = await UserContact.findOne({
      where: { id: contact_id, user_id },
    });

    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    if (contact_name !== undefined) contact.contact_name = contact_name;
    if (is_favorite !== undefined) contact.is_favorite = is_favorite;

    await contact.save();

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Update Contact Error:', error);
    res.status(500).json({ success: false, error: 'Failed to update contact' });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  const { contact_id } = req.params;
  const user_id = req.user.id;

  try {
    const deleted = await UserContact.destroy({
      where: { id: contact_id, user_id },
    });

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete Contact Error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete contact' });
  }
};

// Block/Unblock contact
export const blockContact = async (req, res) => {
  const { contact_id } = req.params;
  const { is_blocked } = req.body;
  const user_id = req.user.id;

  try {
    const contact = await UserContact.findOne({
      where: { id: contact_id, user_id },
    });

    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    contact.is_blocked = is_blocked;
    await contact.save();

    res.json({
      success: true,
      message: `Contact ${is_blocked ? 'blocked' : 'unblocked'} successfully`,
      data: contact,
    });
  } catch (error) {
    console.error('Block Contact Error:', error);
    res.status(500).json({ success: false, error: 'Failed to block/unblock contact' });
  }
};

// Get blocked contacts
export const getBlockedContacts = async (req, res) => {
  const user_id = req.user.id;

  try {
    const blockedContacts = await UserContact.findAll({
      where: { user_id, is_blocked: true },
      include: [
        {
          model: User,
          as: 'contact',
          attributes: ['id', 'username', 'full_name', 'profile_picture'],
        },
      ],
    });

    res.json({ success: true, data: blockedContacts });
  } catch (error) {
    console.error('Get Blocked Contacts Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get blocked contacts' });
  }
};

// Search contacts
export const searchContacts = async (req, res) => {
  const { query } = req.query;
  const user_id = req.user.id;

  try {
    const contacts = await UserContact.findAll({
      where: {
        user_id,
        is_blocked: false,
        [Op.or]: [
          { contact_name: { [Op.like]: `%${query}%` } },
        ],
      },
      include: [
        {
          model: User,
          as: 'contact',
          attributes: ['id', 'username', 'full_name', 'profile_picture', 'is_online'],
          where: {
            [Op.or]: [
              { username: { [Op.like]: `%${query}%` } },
              { full_name: { [Op.like]: `%${query}%` } },
              { phone_number: { [Op.like]: `%${query}%` } },
            ],
          },
        },
      ],
    });

    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Search Contacts Error:', error);
    res.status(500).json({ success: false, error: 'Failed to search contacts' });
  }
};
