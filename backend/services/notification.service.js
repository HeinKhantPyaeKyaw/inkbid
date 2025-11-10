import mongoose from "mongoose";
import Notification from "../schemas/notification.schema.js";
import { getIO } from "../socket.js";

export const notify = async (userId, payload) => {
  try {
    const cleanId =
      typeof userId === "object" && userId?._id
        ? String(userId._id)
        : String(userId);

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      console.warn("notify(): Invalid userId", userId);
      return;
    }

    const notif = await Notification.create({
      ref_user: cleanId,
      ...payload,
    });

    console.log("Emitting to room:", cleanId, payload.title);

    const io = getIO();
    io.to(cleanId).emit("notification", notif);
  } catch (err) {
    console.error("notify() error:", err);
  }
};
