import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const UserSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true, lowercase: true, trim: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    password: { type: String, default: "" },
    role: { type: String, enum: ["buyer", "writer"], index: true },
  },
  { timestamps: true }
);
UserSchema.index({ email: 1, firebaseUid: 1 });

export type UserDoc = InferSchemaType<typeof UserSchema>;
export type UserModel = Model<UserDoc>;

export default (mongoose.models.User as UserModel) || mongoose.model<UserDoc>("User", UserSchema);
