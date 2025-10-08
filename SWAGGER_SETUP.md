# Swagger API Documentation Setup

## Overview
Swagger/OpenAPI 3.0 documentation has been successfully integrated into the ConvoSpace Backend project. All API endpoints are now fully documented and accessible through an interactive UI.

## Access Swagger UI
Once the server is running, access the interactive API documentation at:
```
http://localhost:5000/api-docs
```

## What's Included

### 1. Swagger Configuration
**File:** `config/swagger.js`
- OpenAPI 3.0 specification
- JWT Bearer authentication setup
- Component schemas for:
  - User
  - Message
  - Conversation
  - Error responses
  - Success responses
- Development and Production server configurations

### 2. Documented API Routes

#### Authentication & User Management (`/api`)
- `POST /auth/send-otp` - Send OTP to phone number
- `POST /auth/verify-otp` - Verify OTP and login/register
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update user profile
- `PUT /users/me/status` - Update online status

#### Conversations (`/api`)
- `POST /conversations` - Create new conversation
- `GET /conversations` - Get user's conversations
- `GET /conversations/:conversation_id` - Get specific conversation
- `PUT /conversations/:conversation_id` - Update conversation
- `DELETE /conversations/:conversation_id` - Delete conversation
- `POST /conversations/:conversation_id/participants` - Add participant
- `DELETE /conversations/:conversation_id/participants/:user_id` - Remove participant

#### Messages (`/api`)
- `POST /messages` - Send message
- `GET /messages/:conversation_id` - Get messages in conversation
- `GET /messages/:message_id` - Get specific message
- `PUT /messages/:message_id` - Update message
- `DELETE /messages/:message_id` - Delete message
- `POST /messages/:message_id/status` - Update message status

#### Contacts (`/api`)
- `POST /contacts` - Add contact
- `GET /contacts` - Get user's contacts
- `PUT /contacts/:contact_id` - Update contact
- `DELETE /contacts/:contact_id` - Delete contact
- `POST /contacts/:contact_id/block` - Block contact
- `POST /contacts/:contact_id/unblock` - Unblock contact
- `GET /contacts/search` - Search contacts

#### Notifications (`/api`)
- `POST /notifications` - Create notification
- `GET /notifications` - Get user's notifications
- `PUT /notifications/:notification_id/read` - Mark as read
- `POST /notifications/read-all` - Mark all as read
- `DELETE /notifications/:notification_id` - Delete notification
- `GET /notifications/unread-count` - Get unread count

## How to Use

### 1. Start the Server
```bash
npm start
```

### 2. Open Swagger UI
Navigate to `http://localhost:5000/api-docs` in your browser.

### 3. Authenticate
For protected endpoints (most of them):
1. Click the "Authorize" button at the top right
2. Enter your JWT token in the format: `Bearer <your_token>`
3. Click "Authorize"
4. All subsequent requests will include the token

### 4. Test Endpoints
- Click on any endpoint to expand it
- Click "Try it out"
- Fill in required parameters
- Click "Execute"
- View the response below

## Features

### Interactive Testing
- Test all endpoints directly from the browser
- View request/response formats
- See example values
- Validate parameters

### Authentication
- JWT Bearer token authentication
- Secure endpoints clearly marked
- Easy token management

### Schema Documentation
- All request bodies documented
- Response formats defined
- Error responses included
- Data types and validations specified

### Example Values
- Pre-filled example data for quick testing
- Realistic sample responses
- Enum values for restricted fields

## API Tags
Endpoints are organized by functionality:
- **Authentication** - Login/logout operations
- **User** - User profile management
- **Conversations** - Conversation management
- **Messages** - Message operations
- **Contacts** - Contact management
- **Notifications** - Notification handling

## Security
All protected routes require JWT authentication:
- Obtain token via `/api/auth/verify-otp`
- Include in requests as: `Authorization: Bearer <token>`
- Tokens expire based on JWT_EXPIRY setting
- Use `/api/auth/refresh` to get new token

## Development Notes

### Adding New Endpoints
When adding new endpoints, include Swagger documentation:

```javascript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Brief description
 *     tags: [YourTag]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success response
 */
router.post('/your-endpoint', authenticate, yourController);
```

### Adding New Schemas
Add reusable schemas to `config/swagger.js`:

```javascript
components: {
  schemas: {
    YourModel: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
      }
    }
  }
}
```

## Troubleshooting

### Swagger UI Not Loading
- Ensure server is running
- Check console for errors
- Verify `swagger-jsdoc` and `swagger-ui-express` are installed

### Endpoints Not Showing
- Check JSDoc comments in route files
- Verify file paths in `swagger.js` config
- Restart server after changes

### Authentication Failing
- Get fresh token from `/api/auth/verify-otp`
- Include "Bearer " prefix
- Check token hasn't expired

## Dependencies
```json
{
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.0"
}
```

## Next Steps
1. ✅ All routes documented
2. ✅ Swagger UI integrated
3. 🔄 Test all endpoints via Swagger UI
4. 📝 Share API docs URL with frontend team
5. 🚀 Deploy and update production server URL in config

## Resources
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
