<<<<<<< HEAD
=======
import { verifyAuth } from "../middlewares/auth.middleware.js";
>>>>>>> 🐽TestMerge
import express from "express";
// import { placeBid } from "../controller/bid.controller.js";
const bidsRouter = express.Router();

<<<<<<< HEAD
// bidsRouter.post("/bids", placeBid);
=======
bidsRouter.post("/bids", verifyAuth, placeBid);
>>>>>>> 🐽TestMerge

export default bidsRouter;
