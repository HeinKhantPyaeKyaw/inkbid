import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import redisClient from "./config/redis.js";
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";

const server = http.createServer(app);

// ✅ Attach Socket.IO
const io = new Server(server, {
  cors: { origin: "*" },
});

// ✅ Subscribe to Redis and forward to clients
const sub = redisClient.duplicate();
await sub.connect();

await sub.subscribe("bids_updates", (message) => {
  const data = JSON.parse(message);
  io.emit("bidUpdate", data); // broadcast to all connected clients
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectToDatabase();
});
