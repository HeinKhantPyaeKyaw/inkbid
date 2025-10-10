import mongoose from "mongoose";
import Bid from "../schemas/bids.schema.js";
import Article from "../schemas/article.schema.js";
import View from "../schemas/view.schema.js";

const noStore = (res) => {
  res.set("Cache-Control", "no-store");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
};

// helper
const formatPeriod = (date, range) => {
  const d = new Date(date);
  if (range === "week")
    return `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;
  if (range === "month")
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `${d.getFullYear()}`;
};

// GET /seller-dashboard/analytics?range=week|month|year
export const getSellerAnalytics = async (req, res) => {
  try {
    noStore(res);
    const sellerId = req.user?.id;
    if (!sellerId || !mongoose.isValidObjectId(sellerId)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const range = req.query.range || "week";

    // ---- 1️⃣ Get seller's articles ----
    const sellerArticles = await Article.find(
      { author: sellerId },
      { _id: 1, highest_bid: 1, status: 1 }
    ).lean();
    const articleIds = sellerArticles.map((a) => a._id);

    // ---- 2️⃣ Bids placed (group by week/month/year) ----
    const bidsAgg = await Bid.aggregate([
      { $match: { refId: { $in: articleIds } } },
      { $unwind: "$bids" },
      {
        $group: {
          _id: {
            year: { $year: "$bids.timestamp" },
            month: range !== "year" ? { $month: "$bids.timestamp" } : null,
            week: range === "week" ? { $week: "$bids.timestamp" } : null,
          },
          totalBids: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 } },
    ]);

    // format label for chart
    const bidsSeries = bidsAgg.map((x) => ({
      label: formatPeriod(
        `${x._id.year}-${x._id.month || 1}-${x._id.week || 1}`,
        range
      ),
      count: x.totalBids,
    }));

    // ---- 3️⃣ Views per period ----
    const viewsAgg = await View.aggregate([
      { $match: { ref_article: { $in: articleIds } } },
      {
        $group: {
          _id: {
            year: { $year: "$viewedAt" },
            month: range !== "year" ? { $month: "$viewedAt" } : null,
            week: range === "week" ? { $week: "$viewedAt" } : null,
          },
          totalViews: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 } },
    ]);

    const viewsSeries = viewsAgg.map((x) => ({
      label: formatPeriod(
        `${x._id.year}-${x._id.month || 1}-${x._id.week || 1}`,
        range
      ),
      count: x.totalViews,
    }));

    // ---- 4️⃣ Totals ----
    const totalBids = bidsAgg.reduce((sum, x) => sum + x.totalBids, 0);
    const totalIncome = sellerArticles
      .filter((a) => ["completed", "expired"].includes(a.status))
      .reduce((sum, a) => sum + (a.highest_bid || 0), 0);

    res.json({
      range,
      bidsSeries,
      viewsSeries,
      totalBids,
      totalIncome,
    });
  } catch (err) {
    console.error("getSellerAnalytics error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
