
import Bid from "../schemas/bids.schema.js";
import Article from "../schemas/article.schema.js";
import redisClient from "../config/redis.js";

export const placeBid = async (req, res) => {
  try {
    const { refId, ref_user, amount } = req.body;

    if (!refId || !ref_user || !amount) {
      return res
        .status(400)
        .json({ error: "refId, ref_user, and amount are required" });
    }

    // fetch article (to check highest_bid field)
    const article = await Article.findById(refId);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // fetch bid record
    let bidRecord = await Bid.findOne({ refId: refId });

    // check current highest bid
    let currentHighest = 0;

    if (bidRecord && bidRecord.bids.length > 0) {
      const lastBid = bidRecord.bids[bidRecord.bids.length - 1];
      currentHighest = parseFloat(lastBid.amount.toString());
    } else if (article.highest_bid) {
      currentHighest = parseFloat(article.highest_bid.toString());
    }

    // reject if not higher
    if (amount <= currentHighest) {
      return res.status(400).json({
        success: false,
        message: `Bid must be higher than current highest bid (${currentHighest})`,
      });
    }

    // create new bid
    const newBid = {
      ref_user,
      amount,
      timestamp: new Date(),
    };

    if (!bidRecord) {
      // first bid
      bidRecord = new Bid({
        refId,
        bids: [newBid],
      });
    } else {
      // append bid
      bidRecord.bids.push(newBid);
    }

    await bidRecord.save();

    // update highest_bid in Article
    article.highest_bid = amount;
    await article.save();

    // publish via Redis
    const payload = {
      articleId: refId,
      userId: ref_user,
      amount,
      timestamp: newBid.timestamp,
    };
    await redisClient.publish("bids_updates", JSON.stringify(payload));

    res.status(201).json({
      success: true,
      message: "Bid placed successfully",
      bidRecord,
    });
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(500).json({ error: "Server error" });
  }
};
