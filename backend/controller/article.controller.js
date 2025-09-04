import Article from "../schemas/article.schema.js";
import Bid from "../schemas/bids.schema.js";

export const getAllArticlesWithBids = async (req, res) => {
  try {
    const articles = await Article.find().lean();
    // Fetch bids for each article
    // Fetch top 4 bids for each article
    const results = await Promise.all(
      articles.map(async (article) => {
        const bids = await Bid.findOne({ refId: article._id })
          .populate("bids.ref_user", "name email role") // include buyer info
          .lean();

        // if there are bids, sort by amount (descending) and take top 4
        const topBids = bids
          ? bids.bids
              .sort((a, b) => b.amount - a.amount) // highest first
              .slice(0, 4)
          : [];

        return {
          ...article,
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

    // find the article
    const article = await Article.findById(id).lean();
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // find related bids
    const bids = await Bid.findOne({ refId: article._id })
      .populate("bids.ref_user", "name email role")
      .lean();

    // sort bids by amount (descending) and take top 4
    const topBids = bids
      ? bids.bids
          .sort((a, b) => b.amount - a.amount) // highest first
          .slice(0, 4)
      : [];

    res.status(200).json({
      ...article,
      bids: topBids,
    });
  } catch (err) {
    console.error("Error fetching article with bids:", err);
    res.status(500).json({ error: "Server error" });
  }
};
