import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const ContentSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, index: true },
    overview: { type: String },
    full_content_url: { type: String },
    genre: { type: String },
    base_price: { type: String },
    buy_now_price: { type: String },
    time_stamp: { type: Number },
    bidding_status: { type: String },
    auction_start_time: { type: Number },
    auction_end_time: { type: Number },
  },
  { timestamps: true }
);
ContentSchema.index({ email: 1, firebaseUid: 1 });

export type ContentDoc = InferSchemaType<typeof ContentSchema>;
export type ContentModel = Model<ContentDoc>;

export default (mongoose.models.Content as ContentModel) ||
  mongoose.model<ContentDoc>("Content", ContentSchema);
