import express from "express";
import {
  getProfileInfo,
  updateProfile,
} from "../controller/profile.controller.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import uploadImage from "../middlewares/uploadImage.js";

const sellerProfileRouter = express.Router();

sellerProfileRouter.get("/:id", getProfileInfo);

sellerProfileRouter.put(
  "/update",
  verifyAuth,
  uploadImage.single("profileImage"),
  updateProfile
);

export default sellerProfileRouter;
