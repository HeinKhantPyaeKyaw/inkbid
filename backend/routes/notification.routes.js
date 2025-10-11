import express from "express";
import Notification from "../schemas/notification.schema.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";

const notificationRouter = express.Router();

// List latest notifications (paginated)
notificationRouter.get("/", verifyAuth, async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Notification.find({ ref_user: req.user._id || req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ ref_user: req.user._id || req.user.id }),
  ]);

  res.json({
    items,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
});

// Unread count badge for navbar
notificationRouter.get("/unread-count", verifyAuth, async (req, res) => {
  const count = await Notification.countDocuments({
    ref_user: req.user._id || req.user.id,
    is_read: false,
  });
  res.json({ count });
});

// Mark one as read
notificationRouter.patch("/:id/read", verifyAuth, async (req, res) => {
  await Notification.updateOne(
    { _id: req.params.id, ref_user: req.user._id || req.user.id },
    { $set: { is_read: true, read_at: new Date() } }
  );
  res.json({ ok: true });
});

// Mark all as read
notificationRouter.patch("/read-all", verifyAuth, async (req, res) => {
  await Notification.updateMany(
    { ref_user: req.user._id || req.user.id, is_read: false },
    { $set: { is_read: true, read_at: new Date() } }
  );
  res.json({ ok: true });
});

export default notificationRouter;
