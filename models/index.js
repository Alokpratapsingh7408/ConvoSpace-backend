import { sequelize } from '../config/database.js';
import { User } from './User.js';
import { Session } from './Session.js';
import { OtpVerification } from './OtpVerification.js';
import { Conversation } from './Conversation.js';
import { Message } from './Message.js';
import { MessageStatus } from './MessageStatus.js';
import { TypingIndicator } from './TypingIndicator.js';
import { ConversationParticipant } from './ConversationParticipant.js';
import { UserContact } from './UserContact.js';
import { Notification } from './Notification.js';
import { LoginHistory } from './LoginHistory.js';

// User relationships
User.hasMany(Session, { foreignKey: 'user_id', as: 'sessions' });
Session.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(OtpVerification, { foreignKey: 'user_id', as: 'otpVerifications' });
OtpVerification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(LoginHistory, { foreignKey: 'user_id', as: 'loginHistory' });
LoginHistory.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Conversation relationships
User.hasMany(Conversation, { foreignKey: 'user_one_id', as: 'conversationsAsUserOne' });
User.hasMany(Conversation, { foreignKey: 'user_two_id', as: 'conversationsAsUserTwo' });
Conversation.belongsTo(User, { foreignKey: 'user_one_id', as: 'userOne' });
Conversation.belongsTo(User, { foreignKey: 'user_two_id', as: 'userTwo' });
Conversation.belongsTo(Message, { foreignKey: 'last_message_id', as: 'lastMessage' });

// Message relationships
Conversation.hasMany(Message, { foreignKey: 'conversation_id', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id', as: 'conversation' });
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

// Message Status relationships
Message.hasMany(MessageStatus, { foreignKey: 'message_id', as: 'statuses' });
MessageStatus.belongsTo(Message, { foreignKey: 'message_id', as: 'message' });
User.hasMany(MessageStatus, { foreignKey: 'user_id', as: 'messageStatuses' });
MessageStatus.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Typing Indicator relationships
Conversation.hasMany(TypingIndicator, { foreignKey: 'conversation_id', as: 'typingIndicators' });
TypingIndicator.belongsTo(Conversation, { foreignKey: 'conversation_id', as: 'conversation' });
User.hasMany(TypingIndicator, { foreignKey: 'user_id', as: 'typingIndicators' });
TypingIndicator.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Conversation Participant relationships
Conversation.hasMany(ConversationParticipant, { foreignKey: 'conversation_id', as: 'participants' });
ConversationParticipant.belongsTo(Conversation, { foreignKey: 'conversation_id', as: 'conversation' });
User.hasMany(ConversationParticipant, { foreignKey: 'user_id', as: 'conversationParticipants' });
ConversationParticipant.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
ConversationParticipant.belongsTo(Message, { foreignKey: 'last_read_message_id', as: 'lastReadMessage' });

// User Contact relationships
User.hasMany(UserContact, { foreignKey: 'user_id', as: 'contacts' });
User.hasMany(UserContact, { foreignKey: 'contact_user_id', as: 'contactedBy' });
UserContact.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserContact.belongsTo(User, { foreignKey: 'contact_user_id', as: 'contact' });

// Notification relationships
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export {
  sequelize,
  User,
  Session,
  OtpVerification,
  Conversation,
  Message,
  MessageStatus,
  TypingIndicator,
  ConversationParticipant,
  UserContact,
  Notification,
  LoginHistory,
};
