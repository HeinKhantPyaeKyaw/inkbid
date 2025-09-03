import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import router from "./routes/index.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(router);
  app.use(errorHandler);
  return app;
}
