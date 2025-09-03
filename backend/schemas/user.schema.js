import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/],
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
    rating: { type: Number, min: 0, max: 5, default: 0 }, // from $numberDouble
    img_url: { type: String, required: false, trim: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "Users");

export default User;
