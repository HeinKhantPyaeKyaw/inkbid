import mongoose from 'mongoose';

const buyerInventorySchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },
    purchasedDate: {
      type: Date,
      default: Date.now,
    },
    contractPeriod: {
      type: String,
      required: true,
      default: '30 Days',
    },
    contractStatus: {
      type: String,
      enum: ['active', 'expired'],
      default: 'active',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'paid',
    },
  },
  { timestamps: true },
);

const BuyerInventory = mongoose.model(
  'BuyerInventory',
  buyerInventorySchema,
  'BuyerInventories',
);

export default BuyerInventory;
