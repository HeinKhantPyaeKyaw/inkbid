import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },

    // ----Contract Details-----
    articleTitle: {
      type: String,
      required: true,
      trim: true,
    },
    buyerName: {
      type: String,
      required: true,
      trim: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    finalPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    contractPeriod: {
      type: String,
      default: '30 Days',
    },
    agreementDate: {
      type: Date,
      default: Date.now,
    },
    purchasedDate: {
      type: Date,
    },

    // ----- Status & PDF -----
    status: {
      type: String,
      enum: ['awaiting_payment', 'finalized', 'cancelled'],
      default: 'awaiting_payment',
    },
    contractUrl: {
      type: String,
      trim: true,
    },
    terms: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true },
);

const Contract = mongoose.model('Contract', contractSchema, 'Contracts');

export default Contract;
