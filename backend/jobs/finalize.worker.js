// jobs/finalize.worker.js
import { Worker } from "bullmq";
import { AUCTION_QUEUE, connectionOptions } from "./bullmq.js";
import Article from "../schemas/article.schema.js";

export const finalizeWorker = new Worker(
  AUCTION_QUEUE,
  async (job) => {
    console.log(`⚙️  Processing ${job.name} #${job.id} →`, job.data);

    if (job.name !== "finalizeAuction") return;

    const { articleId } = job.data;
    const article = await Article.findById(articleId).populate("author");

    if (!article) {
      console.warn("⚠️ Article not found:", articleId);
      return;
    }
    if (article.status !== "in_progress") {
      console.log(`⏩ ${articleId} already ${article.status}, skipping`);
      return;
    }

    // Your business rule here:
    if (article.highest_bid && article.highest_bid > 0) {
      article.status = "awaiting_contract"; // or "awaiting_payment"
    } else {
      article.status = "cancelled";
    }

    await article.save();
    console.log(`✅ ${articleId} → ${article.status}`);
  },
  {
    connection: connectionOptions,
    concurrency: 5, // optional: speed up backlog processing
  }
);

finalizeWorker.on("completed", (job) =>
  console.log(`🎯 Completed job ${job.id}`)
);
finalizeWorker.on("failed", (job, err) =>
  console.error(`💥 Failed job ${job?.id}`, err)
);

console.log("🛠️ Worker started for", AUCTION_QUEUE);
