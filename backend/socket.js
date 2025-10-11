// socket.js
import { Server } from "socket.io";
import redisClient from "./config/redis.js";

let ioInstance;

export async function initSocket(server) {
  const io = new Server(server, { cors: { origin: "*" } });
  ioInstance = io;

  // Redis subscriber for bid updates
  const sub = redisClient.duplicate();
  await sub.connect();

  await sub.subscribe("bids_updates", (message) => {
    try {
      const data = JSON.parse(message);
      io.emit("bidUpdate", data);
    } catch (err) {
      console.error("⚠️ Failed to parse bids_updates payload:", err);
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("register", (userId) => {
      if (userId) {
        socket.join(String(userId));
        console.log(`socket joined room ${userId}`);
      }
    });

    socket.on("disconnect", () =>
      console.log("🔴 User disconnected:", socket.id)
    );
  });

  console.log("✅ Socket.IO initialized");
  return io;
}

export function getIO() {
  if (!ioInstance) throw new Error("Socket.IO not initialized yet");
  return ioInstance;
}
