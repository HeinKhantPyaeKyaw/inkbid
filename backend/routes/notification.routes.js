import express from "express";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import {
  getUserNotifications,
  markNotificationRead,
} from "../controller/notification.controller.js";

const notificationRoutes = express.Router();

notificationRoutes.get("/", verifyAuth, getUserNotifications);
notificationRoutes.patch("/:id/read", verifyAuth, markNotificationRead);

export default notificationRoutes;
