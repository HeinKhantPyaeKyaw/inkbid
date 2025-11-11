import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true }, 
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, 
    duration: { type: mongoose.Schema.Types.Decimal128, required: true },
    article_url: { type: String, required: false, trim: true },
    ends_in: { type: Date, required: true }, 
    synopsis: { type: String, trim: true },
    highest_bid: { type: mongoose.Schema.Types.Decimal128, default: 0.0 }, 
    min_bid: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: 0.0,
    },
    buy_now: { type: mongoose.Schema.Types.Decimal128 },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tag: {
      genre: [
        {
          code: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
          keyword: { type: String, trim: true },
        },
      ],
      writing_style: [
        {
          code: { type: mongoose.Schema.Types.ObjectId, ref: "WritingStyle" },
          keyword: { type: String, trim: true },
        },
      ],
    },
    img_url: { type: String, required: false, trim: true },
    proprietor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: [
        "in_progress",
        "awaiting_contract",
        "awaiting_payment",
        "completed",
        "cancelled",
      ],
      default: "in_progress",
    },
    buyerSigned: { type: Boolean, default: false },
    sellerSigned: { type: Boolean, default: false },
    final_price: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Article = mongoose.model('Article', articleSchema, 'Articles');

export default Article;
