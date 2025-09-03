import mongoose from "mongoose";
import { env } from "./env";

export async function connectMongo() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
  } as any);
}
