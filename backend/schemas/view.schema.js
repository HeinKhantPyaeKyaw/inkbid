import mongoose from "mongoose";

const ViewSchema = new mongoose.Schema({
  ref_article: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
  ref_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  viewedAt: { type: Date, default: Date.now },
});

export default mongoose.model("View", ViewSchema);
