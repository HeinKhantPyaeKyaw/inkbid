import mongoose from "mongoose";

const SellerDashboardSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    counters: {
      in_progress: { type: Number, default: 0 },
      awaiting_contract: { type: Number, default: 0 },
      awaiting_payment: { type: Number, default: 0 },
      cancelled: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
    },
    // place for any cached charts / last refresh metadata
    lastComputedAt: { type: Date },
  },
  { timestamps: true, versionKey: false, collection: "seller_dashboard" }
);

export default mongoose.model("SellerDashboard", SellerDashboardSchema);
