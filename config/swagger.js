import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ConvoSpace API',
      version: '1.0.0',
      description: 'Real-time chat application backend API with phone-only OTP authentication',
      contact: {
        name: 'ConvoSpace Team',
        email: 'support@convospace.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.convospace.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            phone_number: {
              type: 'string',
              description: 'User phone number',
            },
            username: {
              type: 'string',
              description: 'Username',
            },
            full_name: {
              type: 'string',
              description: 'Full name',
            },
            profile_picture: {
              type: 'string',
              description: 'Profile picture URL',
            },
            is_online: {
              type: 'boolean',
              description: 'Online status',
            },
            last_seen_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last seen timestamp',
            },
          },
        },
        Message: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Message ID',
            },
            conversation_id: {
              type: 'integer',
              description: 'Conversation ID',
            },
            sender_id: {
              type: 'integer',
              description: 'Sender user ID',
            },
            receiver_id: {
              type: 'integer',
              description: 'Receiver user ID',
            },
            message_text: {
              type: 'string',
              description: 'Message content',
            },
            message_type: {
              type: 'string',
              enum: ['text', 'image', 'file', 'audio', 'video', 'location'],
              description: 'Message type',
            },
            media_url: {
              type: 'string',
              description: 'Media file URL',
            },
            is_edited: {
              type: 'boolean',
              description: 'Whether message is edited',
            },
            is_deleted: {
              type: 'boolean',
              description: 'Whether message is deleted',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
          },
        },
        Conversation: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Conversation ID',
            },
            user_one_id: {
              type: 'integer',
              description: 'First user ID',
            },
            user_two_id: {
              type: 'integer',
              description: 'Second user ID',
            },
            last_message_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last message timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Success message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
