// routes/dev.routes.js
import { Router } from "express";
import { auctionQueue } from "../config/bullmq.js";
const r = Router();

r.post("/_test/finalize/:id", async (req, res) => {
  const articleId = req.params.id;
  await auctionQueue.add(
    "finalizeAuction",
    { articleId },
    { delay: 5000, jobId: `finalize:${articleId}`, removeOnComplete: true }
  );
  res.json({ ok: true, queued: articleId });
});

export default r;
