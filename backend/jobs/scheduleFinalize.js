// jobs/scheduleFinalize.js
import { auctionQueue, finalizeJobId } from "../config/bullmq.js";

export const scheduleOrRescheduleFinalize = async (article) => {
  const articleId = article._id.toString();
  const jobId = finalizeJobId(articleId);

  const now = Date.now();
  const target = new Date(article.ends_in).getTime();
  const delayMs = Math.max(0, target - now);

  // Remove any previous job for this article (idempotent)
  const existing = await auctionQueue.getJob(jobId);
  if (existing) {
    try {
      await existing.remove();
    } catch (e) {
      console.warn("remove old job:", e.message);
    }
  }

  await auctionQueue.add(
    "finalizeAuction",
    { articleId },
    {
      delay: delayMs,
      jobId, // deterministic to prevent duplicates
      removeOnComplete: true,
      attempts: 3,
      backoff: { type: "fixed", delay: 5000 },
    }
  );

  console.log(
    `⏰ Scheduled finalize for ${articleId} in ${Math.round(delayMs / 1000)}s`
  );
};
