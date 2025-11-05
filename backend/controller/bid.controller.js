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

    // check bidder role
    if (bidder.role !== "buyer") {
      return res.status(403).json({ error: "Only buyers can place bids" });
    }

    // fetch article
    const article = await Article.findById(refId);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // fetch bid record
    let bidRecord = await Bid.findOne({ refId });

    // check current highest bid
    let currentHighest = 0;
    if (bidRecord && bidRecord.bids.length > 0) {
      const lastBid = bidRecord.bids[bidRecord.bids.length - 1];
      currentHighest = parseFloat(lastBid.amount.toString());
    } else if (article.highest_bid) {
      currentHighest = parseFloat(article.highest_bid.toString());
    }

    // enforce min_bid if this is the first bid
    if ((!bidRecord || bidRecord.bids.length === 0) && article.min_bid) {
      const minBid = parseFloat(article.min_bid.toString());
      if (amount < minBid) {
        return res.status(422).json({
          success: false,
          message: `The first bid must be at least the minimum bid (${minBid})`,
        });
      }
    }

    // prevent bidding lower or equal than current highest
    if (amount <= currentHighest) {
      return res.status(409).json({
        success: false,
        message: `Bid must be higher than current highest bid (${currentHighest})`,
      });
    }

    // ✅ Notify the previous highest bidder (if any)
    if (bidRecord && bidRecord.bids.length > 0) {
      const lastBid = bidRecord.bids[bidRecord.bids.length - 1];
      const prevBidderId = lastBid.ref_user;
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

    // ⚙️ Create the new bid object
    const now = new Date();
    const newBid = { ref_user: bidder.id, amount, timestamp: now };

    // ✅ Atomic insert: ensure only one equal/higher bid wins
    const updatedBidRecord = await Bid.findOneAndUpdate(
      {
        refId,
        $or: [
          { "bids.amount": { $lt: amount } }, // all existing bids are lower
          { bids: { $size: 0 } }, // or no bids yet
        ],
      },
      {
        $push: { bids: newBid },
      },
      { upsert: true, new: true }
    );

    if (!updatedBidRecord) {
      // another bidder placed equal/higher bid concurrently
      return res.status(409).json({
        success: false,
        message:
          "Bid rejected — another bidder placed the same or higher amount at the same time.",
      });
    }

    // ✅ Send notification to seller (article author)
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

    // ✅ Update article's highest bid atomically
    await Article.updateOne(
      { _id: refId, highest_bid: { $lt: amount } },
      { $set: { highest_bid: amount } }
    );

    // 🔑 Repopulate the latest bid with user details
    const populatedBidRecord = await updatedBidRecord.populate(
      "bids.ref_user",
      "name email img_url rating"
    );
    const latestBid =
      populatedBidRecord.bids[populatedBidRecord.bids.length - 1];

    // Publish via Redis for real-time updates
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

    // ✅ Respond success
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
