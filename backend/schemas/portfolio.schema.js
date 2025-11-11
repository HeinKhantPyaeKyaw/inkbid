import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    synopsis: {
      type: String,
      required: true,
      trim: true,
    },
    publishMedium: {
      type: String,
      trim: true,
    },
    pdfUrl: {
      type: String,
    },
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Portfolio = mongoose.model('Portfolio', portfolioSchema, 'Portfolios');

export default Portfolio;
