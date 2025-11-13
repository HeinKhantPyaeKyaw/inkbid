import express from "express";
import { verifyAuth } from '../middlewares/auth.middleware.js';
import {
  createCheckoutSession,
  stripeWebhook,
} from "../controller/payment.controller.js";

const router = express.Router();

router.post("/create-session", verifyAuth, createCheckoutSession);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
