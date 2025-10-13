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
  // 1) Connect to MongoDB BEFORE anything else touches models
  await connectToDatabase();
  console.log('✅ MongoDB connected');

  // Test Paypal credentials once DB is connected
  await testPayPalConnection();

  // 2) Socket.IO + Redis (pub/sub for live bid updates)
  const io = initIO(server);

  const sub = redisClient.duplicate(); // node-redis v4 duplicate
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

    // client calls: socket.emit('register', userId)
    socket.on('register', (userId) => {
      if (userId) {
        socket.join(String(userId)); // personal room
        console.log(`socket joined room ${userId}`);
      }
    });

    socket.on('disconnect', () =>
      console.log('🔴 User disconnected:', socket.id),
    );
  });

  // 3) BullMQ: load scheduler/queue config AFTER DB is ready
  //    (config sets up Queue + QueueScheduler and waits until ready)
  await import('./jobs/bullmq.js');

  // 4) Start the worker (listens on the SAME queue name)
  await import('./jobs/finalize.worker.js');

  // 5) Kick off recovery once, then run every minute (idempotent)
  const { recoverAndScheduleAuctions } = await import('./jobs/recovery.js');
  await recoverAndScheduleAuctions();
  const recoveryTimer = setInterval(recoverAndScheduleAuctions, 60_000);

  // 6) Start HTTP server
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('🔁 Recovery jobs initialized');
  });

  // 7) Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down...`);
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
      console.log('✅ HTTP server closed');
      // Let BullMQ/ioredis connections close on process exit
      process.exit(0);
    });

    // Failsafe: force exit if close hangs
    setTimeout(() => process.exit(0), 5000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
} catch (err) {
  console.error('❌ Fatal startup error:', err);
  process.exit(1);
}

export { io };
