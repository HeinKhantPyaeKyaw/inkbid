<<<<<<< HEAD
import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
=======
import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
>>>>>>> 🐽TestMerge
export const {
  PORT,
  NODE_ENV,
  DB_URI,
  FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
<<<<<<< HEAD
=======
  REDIS_URL,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_API_BASE,
  PAYPAL_MODE,
>>>>>>> 🐽TestMerge
} = process.env;
