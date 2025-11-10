import pkg from "bullmq";
import { createClient } from "redis";

const { Queue, Worker, QueueScheduler } = pkg;

const connection = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
  },
});

connection.on("error", (err) => console.error("Redis error:", err));
await connection.connect();

const auctionQueue = new Queue("auctionQueue", { connection });

try {
  const scheduler = new QueueScheduler("auctionQueue", { connection });
  await scheduler.waitUntilReady();
  console.log("✅ QueueScheduler is running");
} catch (err) {
  console.warn(
    "QueueScheduler not available in this BullMQ version:",
    err.message
  );
}

const auctionWorker = new Worker(
  "auctionQueue",
  async (job) => {
    console.log("Running job:", job.name);
    if (job.name === "finalizeAuction") {
      const { articleId } = job.data;
      console.log(`Finalizing auction for article ${articleId}`);
    }
  },
  { connection }
);

auctionWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

auctionWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

export { auctionQueue };
