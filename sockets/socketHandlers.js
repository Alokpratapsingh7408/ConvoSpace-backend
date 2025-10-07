export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle typing indicator
    socket.on('typing', ({ senderId, receiverId }) => {
      socket.to(receiverId).emit('typing', { senderId });
    });

    // Handle sending messages
    socket.on('sendMessage', ({ senderId, receiverId, content }) => {
      const message = {
        senderId,
        receiverId,
        content,
        status: 'sent',
        timestamp: new Date(),
      };
      socket.to(receiverId).emit('receiveMessage', message);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
};