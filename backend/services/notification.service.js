import Notification from "../schemas/notification.schema.js";
import { getIO } from "../socket.js"; // ✅ use getIO, not initIO

export const notify = async (userId, payload) => {
  try {
    const notif = await Notification.create({
      ref_user: userId,
      ...payload,
    });

    console.log("📢 Emitting to room:", String(userId));

    const io = getIO(); // ✅ retrieve the existing io instance
    io.to(String(userId)).emit("notification", notif); // ✅ emit correctly
  } catch (err) {
    console.error("❌ notify() error:", err);
  }
};
