# ConvoSpace Backend

Real-time chat application backend built with **Node.js**, **Express**, **Socket.io**, and **MySQL**.

## 🚀 Features

### Authentication & User Management
- ✅ Phone-only OTP authentication (OTP logged to server console)
- ✅ JWT token-based session management
- ✅ User profile management
- ✅ Online/offline status tracking
- ✅ Last seen timestamps
- ✅ Login history and audit logs

### Chat Functionality
- ✅ One-on-one conversations
- ✅ Real-time message delivery via WebSockets
- ✅ Message status tracking (sent, delivered, read)
- ✅ Typing indicators
- ✅ Message editing and deletion
- ✅ Unread message count
- ✅ Chat history with pagination

### Contact Management
- ✅ Add/remove contacts
- ✅ Block/unblock users
- ✅ Favorite contacts
- ✅ Contact search

### Notifications
- ✅ In-app notifications
- ✅ Unread notification count
- ✅ Mark as read functionality

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v8 or higher)
- **npm** or **yarn**

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ConvoSpace-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   DB_NAME=chat_app
   DB_USER=chat_user
   DB_PASSWORD=your_password
   DB_HOST=localhost
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Set up MySQL database**:
   ```sql
   CREATE DATABASE chat_app;
   CREATE USER 'chat_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON chat_app.* TO 'chat_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. **Start the server**:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The application uses the following main tables:

- **users** - User accounts and profiles
- **sessions** - JWT session management
- **otp_verifications** - OTP codes for authentication
- **conversations** - One-on-one chat conversations
- **messages** - Chat messages with media support
- **message_status** - Message delivery and read receipts
- **typing_indicators** - Real-time typing status
- **conversation_participants** - Conversation settings and unread counts
- **user_contacts** - User contact list
- **notifications** - Push and in-app notifications
- **login_history** - User login audit trail

See the ERD diagram for complete schema details.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and login/register
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/status` - Update online status

### Conversations
- `POST /api/conversations` - Create or get conversation
- `GET /api/conversations` - Get all user conversations
- `GET /api/conversations/:id` - Get conversation by ID
- `DELETE /api/conversations/:id` - Delete conversation
- `POST /api/conversations/:id/archive` - Archive conversation
- `PUT /api/conversations/:id/mute` - Mute/unmute conversation

### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/:conversation_id` - Get messages
- `PUT /api/messages/:id/status` - Update message status
- `PUT /api/messages/:id/edit` - Edit message
- `DELETE /api/messages/:id` - Delete message
- `POST /api/messages/:conversation_id/mark-read` - Mark all as read

### Contacts
- `POST /api/contacts` - Add contact
- `GET /api/contacts` - Get all contacts
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `PUT /api/contacts/:id/block` - Block/unblock contact
- `GET /api/contacts/blocked` - Get blocked contacts
- `GET /api/contacts/search` - Search contacts

### Notifications
- `GET /api/notifications` - Get all notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread-count` - Get unread count

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

## 🔌 WebSocket Events

### Client → Server
- `message:send` - Send a new message
- `message:read` - Mark message as read
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `presence:update` - Update online/offline status

### Server → Client
- `message:receive` - Receive new message
- `message:sent` - Message sent confirmation
- `message:delivered` - Message delivered to recipient
- `message:read` - Message read by recipient
- `typing:start` - Contact started typing
- `typing:stop` - Contact stopped typing
- `user:online` - User came online
- `user:offline` - User went offline

## 🏗️ Project Structure

```
ConvoSpace-backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── userController.js
│   ├── messageController.js
│   ├── conversationController.js
│   ├── contactController.js
│   └── notificationController.js
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js
│   ├── Session.js
│   ├── OtpVerification.js
│   ├── Conversation.js
│   ├── Message.js
│   ├── MessageStatus.js
│   ├── TypingIndicator.js
│   ├── ConversationParticipant.js
│   ├── UserContact.js
│   ├── Notification.js
│   ├── LoginHistory.js
│   └── index.js             # Model relationships
├── routes/
│   ├── userRoutes.js
│   ├── messageRoutes.js
│   ├── conversationRoutes.js
│   ├── contactRoutes.js
│   └── notificationRoutes.js
├── sockets/
│   └── socketHandlers.js    # WebSocket event handlers
├── .env                      # Environment variables
├── .gitignore
├── index.js                  # Application entry point
├── package.json
├── API_DOCUMENTATION.md
└── README.md
```

## 🔒 Authentication Flow

1. User sends phone number via `POST /api/auth/send-otp`
2. Server generates 6-digit OTP and logs it to console
3. User submits OTP via `POST /api/auth/verify-otp`
4. Server validates OTP and creates/updates user account
5. Server returns JWT token and refresh token
6. Client includes token in `Authorization: Bearer <token>` header for all protected routes

## 🧪 Testing

### Manual Testing with Postman/cURL

1. **Send OTP**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"phone_number": "+1234567890"}'
   ```

2. **Check server console for OTP**, then verify:
   ```bash
   curl -X POST http://localhost:5000/api/auth/verify-otp \
     -H "Content-Type: application/json" \
     -d '{"phone_number": "+1234567890", "otp_code": "123456", "full_name": "John Doe"}'
   ```

3. **Use returned token for authenticated requests**:
   ```bash
   curl http://localhost:5000/api/user/profile \
     -H "Authorization: Bearer <your_token>"
   ```

## 📝 Development Notes

- OTP codes are logged to server console for development
- Set `sequelize.sync({ alter: true })` in `index.js` for auto-migration during development
- Use `sequelize.sync({ force: false })` in production
- Configure CORS properly for production deployment
- Store JWT_SECRET securely (use environment variables)

## 🚀 Deployment

1. Set environment variables on your hosting platform
2. Update CORS configuration in `index.js`
3. Use `NODE_ENV=production`
4. Set up SSL/TLS certificates
5. Configure database connection pooling
6. Set up process manager (PM2, Forever, etc.)

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

ConvoSpace Backend - Real-time Chat Application

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
