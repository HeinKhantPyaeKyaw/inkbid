// src/hooks/notification.api.ts
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;
// 🔹 Fetch notifications (optionally unread only)
export async function getNotifications(params?: {
  unread?: boolean;
  page?: number;
  limit?: number;
}) {
  const { data } = await axios.get(`${BASE_URL}/notifications`, {
    params,
    withCredentials: true,
  });
  return data;
}

// 🔹 Mark a notification as read
export async function markNotificationRead(id: string) {
  const { data } = await axios.patch(
    `${BASE_URL}/notifications/${id}/read`,
    {},
    { withCredentials: true }
  );
  return data;
}
