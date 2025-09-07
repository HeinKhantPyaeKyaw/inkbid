import mongoose from 'mongoose';
import Article from '../schemas/article.schema.js';
import Bid from '../schemas/bids.schema.js';
import User from '../schemas/user.schema.js';
import { uploadFileToFirebase } from '../services/firebaseupload.js';
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
      .populate('author', 'name img_url rating') // ✅ get author info
      .lean();

    const results = await Promise.all(
      articles.map(async (article) => {
        const bids = await Bid.findOne({ refId: article._id })
          .populate('bids.ref_user', 'name email role')
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
      .populate('author', 'name img_url rating') // ✅ populate seller info
      .lean();

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const bids = await Bid.findOne({ refId: article._id })
      .populate('bids.ref_user', 'name email role')
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
    console.error('Error fetching article with bids:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createArticle = async (req, res) => {
  try {
    // Extract dtat from request body.
    const { title, synopsis, category, duration, minimumBid, buynowPrice } =
      req.body;

    // Validate the required fields
    if (!title || !synopsis || !category || !duration || !minimumBid) {
      return res.status(400).json({ error: 'Missing required field.' });
    }

    // Compute deadline
    const now = new Date();
    const deadline = new Date(
      now.getTime() + Number(duration) * 24 * 60 * 60 * 1000,
    );

    // G real author ID from auth middleware
    const authorID = req.user.id;

    // Handle file uploads
    const imageFile = req.files?.image ? req.files.image[0] : null;
    const articleFile = req.files?.article ? req.files.article[0] : null;

    const imageUrl = await uploadFileToFirebase(imageFile, 'articles/imgs');
    const articleUrl = await uploadFileToFirebase(articleFile, 'articles/pdfs');

    // Create a new article object
    const newArticle = new Article({
      title,
      synopsis,
      date: now,
      author: authorID,
      duration: mongoose.Types.Decimal128.fromString(duration.toString()),
      min_bid: mongoose.Types.Decimal128.fromString(minimumBid.toString()),
      highest_bid: mongoose.Types.Decimal128.fromString('0.0'),
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

    // Respond with success + saved article
    res.status(201).json({
      message: 'Article created successfully',
      article: newArticle,
    });
  } catch (err) {
    console.error('Error creating article:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};
