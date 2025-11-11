import express from "express";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import {
  getSellerSummary,
  getSellerArticles,
  getSellerInventory,
  downloadContract,
  downloadArticle,
} from "../controller/seller-dashboard.controller.js";
import { getSellerAnalytics } from "../controller/seller-analytics.controller.js";

const sellerDashboardRouter = express.Router();

const noStore = (req, res, next) => {
  res.set("Cache-Control", "no-store");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
};

sellerDashboardRouter.get("/summary", verifyAuth, noStore, getSellerSummary);

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

sellerDashboardRouter.get(
  "/analytics",
  verifyAuth,
  noStore,
  getSellerAnalytics
);

sellerDashboardRouter.get(
  "/download/contract/:articleId",
  verifyAuth,
  downloadContract
);
sellerDashboardRouter.get(
  "/download/article/:articleId",
  verifyAuth,
  downloadArticle
);

export default sellerDashboardRouter;
