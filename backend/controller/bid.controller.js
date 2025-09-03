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

    if (amount <= currentHighest) {
      return res.status(400).json({
        success: false,
        message: `Bid must be higher than current highest bid (${currentHighest})`,
      });
    }

    // create new bid
    const newBid = { ref_user, amount, timestamp: new Date() };

    if (!bidRecord) {
      bidRecord = new Bid({ refId, bids: [newBid] });
    } else {
      bidRecord.bids.push(newBid);
    }

    await bidRecord.save();

    // update highest_bid in Article
    article.highest_bid = amount;
    await article.save();

    // 🔑 repopulate the latest bid with user details
    const populatedBidRecord = await bidRecord.populate(
      "bids.ref_user",
      "name email img_url rating"
    );
    const latestBid =
      populatedBidRecord.bids[populatedBidRecord.bids.length - 1];

    // publish via Redis with full user info
    const payload = {
      articleId: refId,
      bidId: latestBid.id,
      amount: Number(latestBid.amount),
      userId: latestBid.ref_user._id,
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
