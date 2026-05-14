const http = require('http');
const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const seedAdmin = require('./config/seed');
const initSocket = require('./socket');
const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const start = async () => {
  await connectDB();
  await seedAdmin();
  const server = http.createServer(app);
  const io = initSocket(server);
  app.set('io', io);

  server.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('UnhandledRejection:', err);
    server.close(() => process.exit(1));
  });
};

start();
