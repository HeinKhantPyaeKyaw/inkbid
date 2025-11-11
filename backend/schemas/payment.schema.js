import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    currency: { type: String, default: "thb" },
    amount_total_thb: { type: Number, required: true }, 
    platform_fee_thb: { type: Number, required: true }, 
    seller_receivable_thb: { type: Number, required: true },

    stripe_session_id: String,
    stripe_payment_intent_id: String,
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema, "Payments");
