import { RequestHandler } from "express";
import { admin } from "../firebase.js"; // your admin init

export const requireAuth: RequestHandler = async (req, res, next) => {
  const h = req.headers.authorization ?? "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ error: "Missing Bearer token" });
    return; // ensure return type is void
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).user = decoded; // attach
    next();
  } catch (e: any) {
    res.status(401).json({ error: "Invalid or expired token", details: e.message });
  }
};