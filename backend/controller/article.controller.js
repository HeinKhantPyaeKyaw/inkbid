import mongoose from 'mongoose';
import Article from '../schemas/article.schema.js';
import Bid from '../schemas/bids.schema.js';
import User from '../schemas/user.schema.js';
import { uploadFileToFirebase } from '../services/firebaseupload.js';

export const getAllArticlesWithBids = async (req, res) => {
  try {
    const articles = await Article.find().lean();
    // Fetch bids for each article
    // Fetch top 4 bids for each article
    const results = await Promise.all(
      articles.map(async (article) => {
        const bids = await Bid.findOne({ refId: article._id })
          .populate('bids.ref_user', 'name email role') // include buyer info
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

    // find the article
    const article = await Article.findById(id).lean();
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // find related bids
    const bids = await Bid.findOne({ refId: article._id })
      .populate('bids.ref_user', 'name email role')
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

    // FIXME: TEMP: Dummy author until you add authentication
    const dummyAuthorId = new mongoose.Types.ObjectId(); // generates a valid new ObjectId

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
      author: dummyAuthorId,
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
