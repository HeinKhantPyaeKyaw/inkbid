import { Server } from "socket.io";

let io;

export const initIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        `http://${process.env.DNS}`,
        `https://${process.env.DNS}`,
      ],
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    socket.on("register", (userId) => {
      if (!userId) return;
      console.log(`👤 User ${userId} registered socket ${socket.id}`);
      socket.join(userId); // <-- critical line: join user’s room
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", socket.id, reason);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
