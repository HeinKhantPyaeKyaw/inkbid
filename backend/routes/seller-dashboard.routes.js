// routes/seller-dashboard.routes.js
import express from "express";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import {
  getSellerSummary,
  getSellerArticles,
  getSellerInventory,
} from "../controller/seller-dashboard.controller.js";

const sellerDashboardRouter = express.Router();

// Keep responses fresh while iterating
const noStore = (req, res, next) => {
  res.set("Cache-Control", "no-store");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
};

// Stat cards
sellerDashboardRouter.get("/summary", verifyAuth, noStore, getSellerSummary);

// Tables
sellerDashboardRouter.get(
  "/articles",
  verifyAuth,
  noStore,
  getSellerArticles
);
sellerDashboardRouter.get(
  "/inventory",
  verifyAuth,
  noStore,
  getSellerInventory
);

export default sellerDashboardRouter;
