// notification.service.js
import Notification from "../schemas/notification.schema.js";

export async function notify(userId, payload) {
  const notif = await Notification.create({
    ref_user: userId,
    ...payload,
  });

  try {
    // Lazy import to avoid circular dependency
    const { io } = await import("../server.js");
    if (io) {
      io.to(String(userId)).emit("notification", notif);
    }
  } catch (err) {
    console.warn("⚠️ Socket emit skipped:", err.message);
  }

  return notif;
}
