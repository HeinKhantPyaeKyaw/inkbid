import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    ref_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "outbid",
        "win",
        "loss",
        "bid",
        "expired",
        "bought",
        "contract",
        "payment",
        "completed",
      ],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },

    target: {
      kind: {
        type: String,
        enum: ["article", "bid", "contract", "order"],
        required: true,
      },
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      url: { type: String },
    },

    read: { type: Boolean, default: false, index: true },
    read_at: { type: Date },
  },
  { timestamps: true, versionKey: false, collection: "notifications" }
);

NotificationSchema.index({ ref_user: 1, createdAt: -1 });

export default mongoose.model("Notification", NotificationSchema);
