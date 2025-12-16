import express from "express";
import { verifyAuth } from '../middlewares/auth.middleware.js';
import {
  createCheckoutSession,
} from "../controller/payment.controller.js";

const router = express.Router();

router.post("/create-session", verifyAuth, createCheckoutSession);

export default router;
