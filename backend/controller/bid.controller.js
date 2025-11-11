import Bid from "../schemas/bids.schema.js";
import Article from "../schemas/article.schema.js";
import redisClient from "../config/redis.js";
import { notify } from "../services/notification.service.js";

export const placeBid = async (req, res) => {
  try {
    const { refId, amount } = req.body;
    const bidder = req.user;

    if (!refId || !amount) {
      return res.status(400).json({ error: "refId and amount are required" });
    }

    if (bidder.role !== "buyer") {
      return res.status(403).json({ error: "Only buyers can place bids" });
    }

    const article = await Article.findById(refId);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    if (
      article.highest_bid === 0 &&
      article.min_bid &&
      amount < article.min_bid
    ) {
      return res.status(422).json({
        success: false,
        message: `The first bid must be at least the minimum bid (${article.min_bid})`,
      });
    }

    const articleUpdate = await Article.findOneAndUpdate(
      { _id: refId, highest_bid: { $lt: amount } },
      { $set: { highest_bid: amount } },
      { new: true }
    );

    if (!articleUpdate) {
      return res.status(409).json({
        success: false,
        message:
          "Bid rejected — another bidder placed the same or higher amount at the same time.",
      });
    }

    const now = new Date();
    const newBid = { ref_user: bidder.id, amount, timestamp: now };

    const bidRecord = await Bid.findOneAndUpdate(
      { refId },
      { $push: { bids: newBid } },
      { upsert: true, new: true }
    );

    if (bidRecord.bids.length > 1) {
      const prevBid = bidRecord.bids[bidRecord.bids.length - 2];
      const prevBidderId = prevBid.ref_user;
      if (String(prevBidderId) !== String(bidder._id)) {
        try {
          await notify(prevBidderId, {
            type: "outbid",
            title: "You were outbid!",
            message: `Someone outbid you on “${article.title}”.`,
            target: {
              kind: "article",
              id: article._id,
              url: `/articles/${article._id}`,
            },
          });
        } catch (notifyErr) {
          console.error("Outbid notification failed:", notifyErr.message);
        }
      }
    }

    try {
      await notify(article.author, {
        type: "bid",
        title: "New bid on your article",
        message: `${bidder.name} bid ฿${amount} on “${article.title}”`,
        target: {
          kind: "article",
          id: article._id,
          url: `/articles/${article._id}`,
        },
      });
    } catch (notifyErr) {
      console.error("Notification failed:", notifyErr.message);
    }

    const populatedBidRecord = await bidRecord.populate(
      "bids.ref_user",
      "name email img_url rating"
    );
    const latestBid =
      populatedBidRecord.bids[populatedBidRecord.bids.length - 1];

    const payload = {
      articleId: refId,
      bidId: latestBid.id,
      amount: Number(latestBid.amount),
      userId: latestBid.ref_user.id,
      userName: latestBid.ref_user.name,
      userImg: latestBid.ref_user.img_url,
      userRating: latestBid.ref_user.rating,
      timestamp: latestBid.timestamp,
    };

    await redisClient.publish("bids_updates", JSON.stringify(payload));

    res.status(201).json({
      success: true,
      message: "Bid placed successfully",
      bid: payload,
    });
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(500).json({ error: "Server error" });
  }
};
