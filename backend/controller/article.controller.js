import mongoose from "mongoose";
import Article from "../schemas/article.schema.js";
import Bid from "../schemas/bids.schema.js";
import { uploadFileToFirebase } from "../services/firebaseupload.js";
import { scheduleOrRescheduleFinalize } from "../jobs/scheduleFinalize.js";
import { notify } from "../services/notification.service.js";

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
    const articles = await Article.find({
      status: "in_progress",
      $or: [{ winner: { $exists: false } }, { winner: null }],
    })
      .populate('author', 'name img_url rating') // ✅ get author info
      .lean();

    const results = await Promise.all(
      articles.map(async (article) => {
        const bids = await Bid.findOne({ refId: article._id })
          .populate('bids.ref_user', 'name email role')
          .lean();

        const topBids = bids
          ? bids.bids
              .map(normalizeBid)
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 4)
          : [];

        return {
          ...normalizeArticle(article),
          bids: topBids,
        };
      }),
    );

    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching articles with bids:', err);
    res.status(500).json({ error: 'Server error' });
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
      .populate("bids.ref_user", "name email role img_url")
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

export const createArticle = async (req, res) => {
  try {
    // Extract dtat from request body.
    const { title, synopsis, category, duration, minimumBid, buynowPrice } =
      req.body;

    // Validate the required fields
    if (!title || !synopsis || !category || !duration || !minimumBid) {
      return res.status(400).json({ error: "Missing required field." });
    }

    // Compute deadline
    const now = new Date();
    const deadline = new Date(
      now.getTime() + Number(duration) * 24 * 60 * 60 * 1000
    );

    // G real author ID from auth middleware
    const authorID = req.user._id;

    // Handle file uploads
    const imageFile = req.files?.image ? req.files.image[0] : null;
    const articleFile = req.files?.article ? req.files.article[0] : null;

    const imageUrl = await uploadFileToFirebase(imageFile, "articles/imgs");
    const articleUrl = await uploadFileToFirebase(articleFile, "articles/pdfs");

    // Create a new article object
    const newArticle = new Article({
      title,
      synopsis,
      date: now,
      author: authorID,
      duration: mongoose.Types.Decimal128.fromString(duration.toString()),
      min_bid: mongoose.Types.Decimal128.fromString(minimumBid.toString()),
      highest_bid: mongoose.Types.Decimal128.fromString("0.0"),
      ends_in: deadline,
      buy_now: buynowPrice
        ? mongoose.Types.Decimal128.fromString(buynowPrice.toString())
        : null,
      tag: { genre: [{ keyword: category }], writing_style: [] },
      img_url: imageUrl,
      article_url: articleUrl,
    });

    // Save article to MongoDB
    await newArticle.save();

    // Enqueue or re-enqueue the finalize job right away
    await scheduleOrRescheduleFinalize(newArticle);

    res.status(201).json({
      message: "Article created successfully",
      article: newArticle,
    });
  } catch (err) {
    console.error("Error creating article:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

export const buyNow = async (req, res) => {
  try {
    const buyer = req.user;
    const buyerId = buyer?._id || buyer?.id;
    const { id } = req.params;

    const article = await Article.findById(id).populate("author");
    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: 'Article not found' });
    }

    // ✅ Update article as instantly won
    article.winner = buyerId;
    article.status = "awaiting_contract";
    article.highest_bid = article.buy_now;
    await article.save();

    // ✅ Optional: record a "Buy Now" bid in the Bid doc
    const now = new Date();
    let bidRecord = await Bid.findOne({ refId: article._id });
    const buyNowBid = {
      ref_user: buyerId,
      amount: article.buy_now,
      timestamp: now,
    };
    if (!bidRecord) {
      bidRecord = new Bid({ refId: article._id, bids: [buyNowBid] });
    } else {
      bidRecord.bids.push(buyNowBid);
    }
    await bidRecord.save();

    // 🔔 Notifications
    // 1️⃣ Notify Buyer — you won instantly (same as auction win)
    await notify(buyerId, {
      type: "win",
      title: "🎉 You won instantly!",
      message: `You purchased “${article.title}” for ฿${Number(
        article.buy_now
      )}. Please sign the contract to proceed.`,
      target: {
        kind: "article",
        id: article._id,
        url: `/dashboard/buyer/articles/${article._id}`,
      },
    });

    // 2️⃣ Notify Seller — your article was bought
    await notify(article.author, {
      type: "bought",
      title: "🏆 Your article was bought",
      message: `“${article.title}” was purchased for ฿${Number(
        article.buy_now
      )}. Please sign the contract to proceed with the payment process.`,
      target: {
        kind: "article",
        id: article._id,
        url: `/dashboard/seller/articles/${article._id}`,
      },
    });

    // ✅ Prepare clean response (convert Decimal128 → number)
    const responseArticle = {
      ...article.toObject(),
      highest_bid: parseFloat(article.highest_bid?.toString() || '0'),
      min_bid: parseFloat(article.min_bid?.toString() || '0'),
      buy_now: parseFloat(article.buy_now?.toString() || '0'),
    };

    return res.status(200).json({
      success: true,
      message: 'Article bought successfully',
      article: responseArticle,
    });
  } catch (err) {
    console.error('Error in buyNow:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const finalizeAuction = async (articleId) => {
  const now = new Date();
  const article = await Article.findById(articleId);
  if (!article) return;

  // already finalized / not in progress
  if (article.status && article.status !== "in_progress") return;

  // not yet expired
  if (now < new Date(article.ends_in)) return;

  // pick highest bid
  const bidDoc = await Bid.findOne({ refId: article._id }).lean();
  let highest = null;

  if (bidDoc?.bids?.length) {
    highest = [...bidDoc.bids].sort(
      (a, b) => Number(b.amount) - Number(a.amount)
    )[0];
  }

  if (highest) {
    article.winner = highest.ref_user; // ObjectId of buyer
    article.status = "awaiting_contract";
    article.highest_bid = highest.amount;
  } else {
    article.status = "cancelled"; // or "expired_without_bids"
  }

  await article.save();

  // optional: notify clients
  // import { io } from "../server.js";
  // io.emit("auctionFinalized", { articleId, status: article.status, winner: article.winner });
};
