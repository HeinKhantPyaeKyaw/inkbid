import express from "express";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.js";
import {
  createPortfolio,
  deletePortfolio,
  getAllPortfolio,
} from "../controller/portfolio.controller.js";

const portfolioRouter = express.Router();

portfolioRouter.get("/portfolios", getAllPortfolio);
portfolioRouter.post(
  "/portfolios",
  verifyAuth,
  upload.single("pdf"),
  createPortfolio
);
portfolioRouter.delete("/portfolios/:id", verifyAuth, deletePortfolio);

export default portfolioRouter;
