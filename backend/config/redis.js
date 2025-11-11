import { createClient } from "redis";

const redisClient = createClient({
<<<<<<< HEAD
  url: "redis://localhost:6379",
=======
    url: process.env.REDIS_URL || "redis://localhost:6379"
>>>>>>> 🐽TestMerge
});

redisClient.on("error", (err) => console.error("Redis error:", err));
await redisClient.connect();

export default redisClient;
