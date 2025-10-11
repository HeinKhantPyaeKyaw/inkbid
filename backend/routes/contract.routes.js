import express from "express";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import { sellerSignContract } from "../controller/contract.controller.js";

const router = express.Router();

// Either buyer or seller can hit this route
router.patch("/:articleId/sign", verifyAuth, sellerSignContract);

export default router;
