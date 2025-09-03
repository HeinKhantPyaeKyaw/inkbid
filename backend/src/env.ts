import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_API_KEY: z.string(),
  MONGODB_URI: z.string().url().or(z.string().startsWith("mongodb://")),
});

export const env = EnvSchema.parse(process.env);
