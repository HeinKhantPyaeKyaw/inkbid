import Article from "../schemas/article.schema.js";
import { auctionQueue, finalizeJobId } from "./bullmq.js";

const log = (...args) => console.log("🔁", ...args);

export const recoverAndScheduleAuctions = async () => {
  try {
    log("Running auction recovery sweep...");

    const now = new Date();

    const overdue = await Article.find({
      status: "in_progress",
      ends_in: { $lte: now },
    }).select("_id ends_in");

    const future = await Article.find({
      status: "in_progress",
      ends_in: { $gt: now },
    }).select("_id ends_in");

    log(`Found ${overdue.length} overdue, ${future.length} future auctions`);

    for (const a of overdue) {
      const id = a._id.toString();
      const jobId = finalizeJobId(id);
      const existing = await auctionQueue.getJob(jobId);

      if (existing) {
        const st = await existing.getState();
        if (st === "failed" || st === "stalled" || st === "delayed") {
          try {
            await existing.remove();
          } catch {
            // ignore
          }
        } else {
          continue;
        }
      }

      await auctionQueue.add(
        "finalizeAuction",
        { articleId: id },
        {
          delay: 0,
          jobId,
          removeOnComplete: true,
          attempts: 3,
          backoff: { type: "fixed", delay: 3000 },
        }
      );
      log(`Queued immediate finalize for ${id}`);
    }

    for (const a of future) {
      const id = a._id.toString();
      const jobId = finalizeJobId(id);
      const existing = await auctionQueue.getJob(jobId);

      const delayMs = Math.max(0, new Date(a.ends_in).getTime() - Date.now());

      let need = !existing;
      if (existing) {
        const st = await existing.getState();
        if (st === "failed" || st === "stalled") need = true;
      }

      if (need) {
        if (existing) {
          try {
            await existing.remove();
          } catch {
            // ignore
          }
        }
        await auctionQueue.add(
          "finalizeAuction",
          { articleId: id },
          {
            delay: delayMs,
            jobId,
            removeOnComplete: true,
            attempts: 3,
            backoff: { type: "fixed", delay: 3000 },
          }
        );
        log(`Ensured finalize for ${id} in ~${Math.round(delayMs / 1000)}s`);
      }
    }

    log("Recovery sweep complete");
  } catch (err) {
    console.error(" Error in recovery:", err);
  }
};
