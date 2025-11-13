import { verifyAuth } from "../middlewares/auth.middleware.js";
import express from "express";
import { placeBid } from "../controller/bid.controller.js";
const bidsRouter = express.Router();

bidsRouter.post("/bids", verifyAuth, placeBid);

export default bidsRouter;
