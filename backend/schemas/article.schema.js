// models/Article.js
import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true }, // stored as MongoDB Date
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // seller reference
    duration: { type: mongoose.Schema.Types.Decimal128, required: true },
    article_url: { type: String, required: false, trim: true },
    ends_in: { type: Date, required: true }, // deadline
    synopsis: { type: String, trim: true },
    highest_bid: { type: mongoose.Schema.Types.Decimal128, default: 0.0 }, // from $numberDecimal
    min_bid: { type: mongoose.Schema.Types.Decimal128, required: true, default: 0.0 }, // from $numberDecimal
    buy_now: { type: mongoose.Schema.Types.Decimal128 },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // buyer reference
    tag: {
      genre: [
        {
          code: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }, // genre reference
          keyword: { type: String, trim: true },
        },
      ],
      writing_style: [
        {
          code: { type: mongoose.Schema.Types.ObjectId, ref: 'WritingStyle' }, // writing style reference
          keyword: { type: String, trim: true },
        },
      ],
    },
    img_url: { type: String, required: false, trim: true },
    proprietor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // final owner (after payment)
    status: { type: String, enum: ['in_progress', 'awaiting_contract', 'awaiting_payment', 'completed', 'cancelled'], default: 'in_progress' },
  },
  { timestamps: true },
);

const Article = mongoose.model('Article', articleSchema, 'Articles');

export default Article;
