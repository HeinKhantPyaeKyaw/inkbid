// controller/sellerDashboard.controller.js
import mongoose from "mongoose";
import Article from "../schemas/article.schema.js";
import Bid from "../schemas/bids.schema.js";
import Contract from "../schemas/contract.schema.js";

const ACTIVE_STATUSES = [
  "in_progress",
  "awaiting_contract",
  "awaiting_payment",
  "cancelled",
];
const INVENTORY_STATUSES = ["completed"];

// Decimal128 → Number (or 0)
const toNum = (v) => {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v) || 0;
  if (v && typeof v.toString === "function") return Number(v.toString()) || 0;
  return 0;
};

const noStore = (res) => {
  res.set("Cache-Control", "no-store");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
};

// GET /seller-dashboard/summary
export const getSellerSummary = async (req, res) => {
  try {
    noStore(res);
    const sellerId = req.user?.id;
    if (!sellerId || !mongoose.isValidObjectId(sellerId)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const byStatus = await Article.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(sellerId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const map = Object.fromEntries(byStatus.map((d) => [d._id, d.count]));
    res.json({
      in_progress: map.in_progress || 0,
      awaiting_contract: map.awaiting_contract || 0,
      awaiting_payment: map.awaiting_payment || 0,
      cancelled: map.cancelled || 0,
      completed: map.completed || 0,
      expired: map.expired || 0,
    });
  } catch (err) {
    console.error("getSellerSummary error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Utility to fetch paginated articles + top bid
const fetchPaginatedArticles = async ({
  sellerId,
  statuses,
  page,
  limit,
  sort,
}) => {
  const q = {
    author: new mongoose.Types.ObjectId(sellerId),
    status: { $in: statuses },
  };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Article.find(q)
      .populate("author", "name email")  // ✅ include seller
      .populate("winner", "name email")  // ✅ include buyer
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Article.countDocuments(q),
  ]);

  // Map of { articleId: maxBid }
  const ids = items.map((a) => a._id);
  const bidAgg = ids.length
    ? await Bid.aggregate([
        { $match: { refId: { $in: ids } } },
        { $project: { refId: 1, maxBid: { $max: "$bids.amount" } } },
      ])
    : [];
  const maxBidMap = new Map(
    bidAgg.map((b) => [String(b.refId), toNum(b.maxBid)])
  );

  const rows = items.map((a) => ({
    _id: a._id,
    title: a.title,
    author: a.author,
    winner: a.winner || null,
    status: a.status,
    date: a.date,
    ends_in: a.ends_in,
    min_bid: toNum(a.min_bid),
    highest_bid: toNum(a.highest_bid),
    current_bid: maxBidMap.get(String(a._id)) ?? toNum(a.highest_bid),
    buy_now: toNum(a.buy_now),
    img_url: a.img_url,
    // ✅ include new fields
    buyerSigned: a.buyerSigned ?? false,
    sellerSigned: a.sellerSigned ?? false,
  }));

  return {
    items: rows,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};


// GET /seller-dashboard/articles?Page=1&limit=10&sort=-date
export const getSellerArticles = async (req, res) => {
  try {
    noStore(res);
    const sellerId = req.user?.id;
    if (!sellerId || !mongoose.isValidObjectId(sellerId)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
    const sort = req.query.sort || "-date"; // newest first

    const data = await fetchPaginatedArticles({
      sellerId,
      statuses: ACTIVE_STATUSES,
      page,
      limit,
      sort,
    });

    res.json(data);
  } catch (err) {
    console.error("getSellerArticles error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /seller-dashboard/inventory?page=1&limit=10&sort=-date
export const getSellerInventory = async (req, res) => {
  try {
    noStore(res);
    const sellerId = req.user?.id;
    if (!sellerId || !mongoose.isValidObjectId(sellerId)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
    const sort = req.query.sort || "-date";

    const data = await fetchPaginatedArticles({
      sellerId,
      statuses: INVENTORY_STATUSES,
      page,
      limit,
      sort,
    });

    res.json(data);
  } catch (err) {
    console.error("getSellerInventory error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* -------------------------------------------------------------------------- */
/* 🧾 DOWNLOAD CONTRACT (for seller)                                           */
/* -------------------------------------------------------------------------- */
export const downloadContract = async (req, res) => {
  try {
    const { articleId } = req.params;

    const contract = await Contract.findOne({ article: articleId });
    if (!contract) {
      return res.status(404).json({ success: false, message: "Contract not found" });
    }

    if (!contract.contractUrl) {
      return res.status(404).json({ success: false, message: "Contract file not available" });
    }

    // Redirect the browser to the file URL (Firebase / GCS / etc.)
    return res.redirect(contract.contractUrl);
  } catch (err) {
    console.error("Error downloading seller contract:", err);
    res.status(500).json({ success: false, message: "Failed to download contract" });
  }
};

/* -------------------------------------------------------------------------- */
/* 📄 DOWNLOAD ARTICLE (for seller)                                            */
/* -------------------------------------------------------------------------- */
export const downloadArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    if (!article.article_url) {
      return res.status(404).json({ success: false, message: "Article file not available" });
    }

    return res.redirect(article.article_url);
  } catch (err) {
    console.error("Error downloading seller article:", err);
    res.status(500).json({ success: false, message: "Failed to download article" });
  }
};