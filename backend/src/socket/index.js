const { Server } = require('socket.io');
const env = require('../config/env');
const { verifyToken } = require('../utils/jwt');

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (token) {
        const decoded = verifyToken(token);
        socket.user = decoded;
      }
      next();
    } catch (err) {
      next(); // allow anonymous; restrict per-room as needed
    }
  });

  io.on('connection', (socket) => {
    socket.on('project:join', (projectId) => {
      if (projectId) socket.join(`project:${projectId}`);
    });
    socket.on('project:leave', (projectId) => {
      if (projectId) socket.leave(`project:${projectId}`);
    });
  });

  return io;
};

module.exports = initSocket;
