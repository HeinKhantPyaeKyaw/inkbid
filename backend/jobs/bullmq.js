// jobs/bullmq.js
import { Queue } from "bullmq";

export const AUCTION_QUEUE = "auction.finalize";

export const connectionOptions = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD || undefined,
    };

export const auctionQueue = new Queue(AUCTION_QUEUE, {
  connection: connectionOptions,
});

// ✅ Use only safe characters (no colon):
export const finalizeJobId = (articleId) => `finalize_${articleId}`;
