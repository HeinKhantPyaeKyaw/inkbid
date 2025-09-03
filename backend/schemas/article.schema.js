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
    img_url: { type: String, required: false, trim: true },
    article_url: { type: String, required: false, trim: true },
    min_bid: { type: mongoose.Schema.Types.Decimal128, required: true },
    ends_in: { type: Date, required: true }, // deadline
    synopsis: { type: String, trim: true },
    highest_bid: { type: mongoose.Schema.Types.Decimal128, default: 0.0 }, // from $numberDecimal
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
  },
  { timestamps: true },
);

const Article = mongoose.model('Article', articleSchema, 'Articles');

export default Article;
