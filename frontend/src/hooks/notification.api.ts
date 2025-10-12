// src/hooks/notification.api.ts
import axios from "axios";

const API_BASE = "http://localhost:5500/api/v1/notifications";

// 🔹 Fetch notifications (optionally unread only)
export async function getNotifications(params?: {
  unread?: boolean;
  page?: number;
  limit?: number;
}) {
  const { data } = await axios.get(API_BASE, {
    params,
    withCredentials: true,
  });
  return data;
}

// 🔹 Mark a notification as read
export async function markNotificationRead(id: string) {
  const { data } = await axios.patch(
    `${API_BASE}/${id}/read`,
    {},
    { withCredentials: true }
  );
  return data;
}
