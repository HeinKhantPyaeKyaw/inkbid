import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
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
    role: {
      type: String,
      required: true,
      enum: ['buyer', 'seller'],
      default: 'buyer',
    },
    rating: { type: Number, min: 0, max: 5, default: 0 }, // from $numberDouble
    img_url: { type: String, required: false, trim: true },
    specialization: { type: String, required: false, trim: true, default: '' },
    writingStyle: { type: String, required: false, trim: true, default: '' },
    bio: { type: String, required: false, trim: true, default: '' },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema, 'Users');

export default User;
