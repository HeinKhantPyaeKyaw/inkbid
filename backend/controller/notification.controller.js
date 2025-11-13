import Notification from "../schemas/notification.schema.js";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { unread, limit = 20, page = 1 } = req.query;
    const filter = { ref_user: userId };
    if (unread === "true") filter.read = false;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Notification.countDocuments(filter),
    ]);

    res.json({
      items,
      page: Number(page),
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("getUserNotifications error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    await Notification.updateOne({ _id: id, ref_user: userId }, { read: true });
    res.json({ success: true });
  } catch (err) {
    console.error("markNotificationRead error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
