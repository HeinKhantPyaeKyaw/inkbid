// routes/payment.routes.js
import express from "express";
import { verifyAuth } from '../middlewares/auth.middleware.js';
import {
  createCheckoutSession,
  stripeWebhook,
} from "../controller/payment.controller.js";

const router = express.Router();

// Create Checkout Session (buyer clicks Pay Now)
router.post("/create-session", verifyAuth, createCheckoutSession);

// Stripe Webhook (must use raw body ONLY for this route)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
