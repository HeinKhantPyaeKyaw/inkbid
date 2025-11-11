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
    buyerSigned: article.buyerSigned ?? false,
    sellerSigned: article.sellerSigned ?? false,
    final_price: Number(article.final_price ?? 0),
    fees: Number(article.fees ?? 0),
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
    const {
      q,
      genre,
      rating,
      sort,
      dir = "desc",
      page = 1,
      limit = 12,
    } = req.query;

    const query = {
      status: "in_progress",
    };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { synopsis: { $regex: q, $options: "i" } },
      ];
    }

    if (genre) {
      query["tag.genre.keyword"] = { $regex: new RegExp(genre, "i") };
    }

    if (rating) {
      const ratingNumber = parseInt(rating);
      query["author.rating"] = { $gte: ratingNumber };
    }

    const skip = (Number(page) - 1) * Number(limit);

    let articles = await Article.find(query)
      .populate("author", "name rating")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    articles = articles.filter((a) => a.status === "in_progress");

    articles = articles.map((article) => ({
      ...article,
      highest_bid: Number(article.highest_bid ?? 0),
      min_bid: Number(article.min_bid ?? 0),
      buy_now: Number(article.buy_now ?? 0),
      final_price: Number(article.final_price ?? 0),
      fees: Number(article.fees ?? 0),
    }));

    const direction = dir === "asc" ? 1 : -1;
    if (sort === "highest_bid") {
      articles.sort((a, b) => (a.highest_bid - b.highest_bid) * direction);
    } else if (sort === "buy_now") {
      articles.sort((a, b) => (a.buy_now - b.buy_now) * direction);
    } else if (sort === "ends_in") {
      articles.sort(
        (a, b) => (new Date(a.ends_in) - new Date(b.ends_in)) * direction
      );
    }

    const total = await Article.countDocuments({
      ...query,
      status: "in_progress", 
    });

    res.status(200).json({
      page: Number(page),
      total,
      totalPages: Math.ceil(total / limit),
      items: articles,
    });
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: "Failed to load marketplace articles" });
  }
};



export const getArticleWithBids = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id)
      .populate("author", "name img_url rating") 
      .lean();

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const bids = await Bid.findOne({ refId: article._id })
      .populate("bids.ref_user", "name email role img_url")
      .lean();

    const topBids = bids
      ? bids.bids
          .map(normalizeBid) 
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 4)
      : [];

    res.status(200).json({
      ...normalizeArticle(article), 
      bids: topBids,
    });
  } catch (err) {
    console.error("Error fetching article with bids:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createArticle = async (req, res) => {
  try {
    const { title, synopsis, category, duration, minimumBid, buynowPrice } =
      req.body;

    if (!title || !synopsis || !category || !duration || !minimumBid) {
      return res.status(400).json({ error: "Missing required field." });
    }

    const now = new Date();
    const deadline = new Date(
      now.getTime() + Number(duration) * 24 * 60 * 60 * 1000
    );

    const authorID = req.user._id;

    const imageFile = req.files?.image ? req.files.image[0] : null;
    const articleFile = req.files?.article ? req.files.article[0] : null;

    const imageUrl = await uploadFileToFirebase(imageFile, "articles/imgs");
    const articleUrl = await uploadFileToFirebase(articleFile, "articles/pdfs");

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

    await newArticle.save();

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

    article.winner = buyerId;
    article.status = "awaiting_contract";
    article.highest_bid = article.buy_now;
    await article.save();

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

  if (article.status && article.status !== "in_progress") return;

  if (now < new Date(article.ends_in)) return;

  const bidDoc = await Bid.findOne({ refId: article._id }).lean();
  let highest = null;

  if (bidDoc?.bids?.length) {
    highest = [...bidDoc.bids].sort(
      (a, b) => Number(b.amount) - Number(a.amount)
    )[0];
  }

  if (highest) {
    article.winner = highest.ref_user; 
    article.status = "awaiting_contract";
    article.highest_bid = highest.amount;
  } else {
    article.status = "cancelled"; 
  }

  await article.save();

};
