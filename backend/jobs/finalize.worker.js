// jobs/finalize.worker.js
import { Worker } from "bullmq";
import { AUCTION_QUEUE, connectionOptions } from "./bullmq.js";
import Article from "../schemas/article.schema.js";
import Bid from "../schemas/bids.schema.js";
import { notify } from "../services/notification.service.js";

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

    // --- Find bids for this article
    const bidDoc = await Bid.findOne({ refId: article._id }).lean();
    let highestBid = null;

    if (bidDoc?.bids?.length) {
      highestBid = [...bidDoc.bids].sort(
        (a, b) => Number(b.amount) - Number(a.amount)
      )[0];
    }

    // 🟢 CASE 1: There is a valid winner
    if (highestBid) {
      article.winner = highestBid.ref_user;
      article.status = "awaiting_contract";
      article.highest_bid = highestBid.amount;
      await article.save();

      // ✅ Notify buyer (winner)
      await notify(highestBid.ref_user, {
        type: "win",
        title: "🎉 You won the auction!",
        message: `You won “${article.title}” for ฿${highestBid.amount}. Please sign the contract to proceed.`,
        target: {
          kind: "article",
          id: article._id,
          url: `/dashboard/buyer/articles/${article._id}`,
        },
      });

      // ✅ Notify seller (their article got a winning bid)
      await notify(article.author._id || article.author.id, {
        type: "winner_found",
        title: "🏆 Article has a winner",
        message: `“${article.title}” received a winning bid of ฿${highestBid.amount}. Wait for the buyer to sign the contract.`,
        target: {
          kind: "article",
          id: article._id,
          url: `/dashboard/seller/articles/${article._id}`,
        },
      });

      // ✅ Notify other bidders that they lost (optional)
      const losers = bidDoc.bids
        .map((b) => b.ref_user.toString())
        .filter(
          (userId) =>
            userId !== highestBid.ref_user.toString() &&
            userId !== (article.author._id || article.author.id).toString()
        );

      for (const loserId of [...new Set(losers)]) {
        await notify(loserId, {
          type: "loss",
          title: "Auction ended",
          message: `You didn’t win “${article.title}”. Better luck next time!`,
          target: {
            kind: "article",
            id: article._id,
            url: `/dashboard/buyer/articles/${article._id}`,
          },
        });
      }
    }

    // 🔴 CASE 2: No bids → cancelled / passed
    else {
      article.status = "cancelled"; // same status you already use for expired auctions
      await article.save();

      // ✅ Notify seller about article passing
      await notify(article.author._id || article.author.id, {
        type: "expired",
        title: "🕒 Auction ended — no bids",
        message: `“${article.title}” ended without any bids.`,
        target: {
          kind: "article",
          id: article._id,
          url: `/dashboard/seller/articles/${article._id}`,
        },
      });
    }

    console.log(`✅ ${articleId} → ${article.status}`);
  },
  {
    connection: connectionOptions,
    concurrency: 5,
  }
);

finalizeWorker.on("completed", (job) =>
  console.log(`🎯 Completed job ${job.id}`)
);
finalizeWorker.on("failed", (job, err) =>
  console.error(`💥 Failed job ${job?.id}`, err)
);

console.log("🛠️ Worker started for", AUCTION_QUEUE);
