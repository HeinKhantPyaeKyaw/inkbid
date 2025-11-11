<<<<<<< HEAD
import http from "http";
// import { Server } from "socket.io";
import app from "./app.js";
// import redisClient from "./config/redis.js";
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";

const server = http.createServer(app);

// ✅ Attach Socket.IO
// const io = new Server(server, {
//   cors: { origin: "*" },
// });

// // ✅ Subscribe to Redis and forward to clients
// const sub = redisClient.duplicate();
// await sub.connect();

// await sub.subscribe("bids_updates", (message) => {
//   const data = JSON.parse(message);
//   io.emit("bidUpdate", data); // broadcast to all connected clients
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

server.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
=======
// server.js
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { PORT } from './config/env.js';
import { testPayPalConnection } from './config/paypal.config.js';
import redisClient from './config/redis.js';
import connectToDatabase from './database/mongodb.js';
import { initIO } from './socket.js';

const server = http.createServer(app);
let io;
try {
>>>>>>> 🐽TestMerge
  await connectToDatabase();
  console.log('✅ MongoDB connected');

  await testPayPalConnection();

  const io = initIO(server);

  const sub = redisClient.duplicate();
  await sub.connect();

  await sub.subscribe('bids_updates', (message) => {
    try {
      const data = JSON.parse(message);
      io.emit('bidUpdate', data);
    } catch (e) {
      console.error('⚠️ Failed to parse bids_updates payload:', e);
    }
  });

  io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);

    socket.on('register', (userId) => {
      if (userId) {
        socket.join(String(userId));
        console.log(`socket joined room ${userId}`);
      }
    });

    socket.on('disconnect', () =>
      console.log('🔴 User disconnected:', socket.id),
    );
  });

  await import('./jobs/bullmq.js');

  await import('./jobs/finalize.worker.js');

  const { recoverAndScheduleAuctions } = await import('./jobs/recovery.js');
  await recoverAndScheduleAuctions();
  const recoveryTimer = setInterval(recoverAndScheduleAuctions, 60_000);

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Recovery jobs initialized');
  });

  const shutdown = async (signal) => {
    console.log(`\n Received ${signal}. Shutting down...`);
    clearInterval(recoveryTimer);

    try {
      await sub.unsubscribe('bids_updates');
    } catch {
      // intentionally ignored
    }
    try {
      await sub.quit();
    } catch (e) {
      console.warn('Redis sub quit error:', e?.message);
    }

    try {
      io.close();
    } catch {
      // intentionally ignored
    }

    server.close(() => {
      process.exit(0);
    });

    setTimeout(() => process.exit(0), 5000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
} catch (err) {
  console.error('Fatal startup error:', err);
  process.exit(1);
}

export { io };
