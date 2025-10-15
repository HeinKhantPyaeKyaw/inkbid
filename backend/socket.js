// backend/socket.js
import { Server } from "socket.io";

let io;

export const initIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.DNS || "http://localhost:3000",
      credentials: true,
    },
  });
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
