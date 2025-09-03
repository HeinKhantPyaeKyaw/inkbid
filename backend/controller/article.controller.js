import Article from "../schemas/article.schema.js";
import Bid from "../schemas/bids.schema.js";
import User from "../schemas/user.schema.js";

function normalizeArticle(article) {
  return {
    ...article,
    highest_bid: Number(article.highest_bid ?? 0),
    min_bid: Number(article.min_bid ?? 0),
    buy_now: Number(article.buy_now ?? 0),
  };
}

function normalizeBid(bid) {
  return {
    ...bid,
    amount: Number(bid.amount ?? 0),
  };
}


export const getAllArticlesWithBids = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author", "name img_url rating") // ✅ get author info
      .lean();

    const results = await Promise.all(
      articles.map(async (article) => {
        const bids = await Bid.findOne({ refId: article._id })
          .populate("bids.ref_user", "name email role")
          .lean();

        const topBids = bids
          ? bids.bids
              .map(normalizeBid) // ✅ convert Decimal128 to Number
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 4)
          : [];

        return {
          ...normalizeArticle(article), // ✅ normalize article fields
          bids: topBids,
        };
      })
    );

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching articles with bids:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getArticleWithBids = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id)
      .populate("author", "name img_url rating") // ✅ populate seller info
      .lean();

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const bids = await Bid.findOne({ refId: article._id })
      .populate("bids.ref_user", "name email role")
      .lean();

    const topBids = bids
      ? bids.bids
          .map(normalizeBid) // ✅ convert amount
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 4)
      : [];

    res.status(200).json({
      ...normalizeArticle(article), // ✅ normalize article fields
      bids: topBids,
    });
  } catch (err) {
    console.error("Error fetching article with bids:", err);
    res.status(500).json({ error: "Server error" });
  }
};

