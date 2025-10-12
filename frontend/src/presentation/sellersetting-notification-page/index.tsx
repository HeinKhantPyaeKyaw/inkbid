"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";
import { io } from "socket.io-client";
import { useAuth } from "@/context/auth/AuthContext";
import {
  getNotifications,
  markNotificationRead,
} from "@/hooks/notification.api"; // ✅ imported API functions

// ================== styled-components ==================
const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const NotificationList = styled.div`
  margin-top: 20px;
`;

const NotificationItem = styled.div`
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

const NotificationDate = styled.div`
  font-size: 14px;
  color: #777;
`;

const NotificationMessage = styled.div`
  font-size: 16px;
  margin-top: 5px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
`;

// ================== Interfaces ==================
interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
}

// ================== Main Component ==================
const SettingsPage: React.FC = () => {
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [selectId, setSelectId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  // ✅ Get userId only once when user changes
  const userId = user?.id ?? null;

  // ✅ Fetch notifications once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotifications();
        setNotificationList(data.items ?? data); // handle both object or array
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Setup socket listener once userId is known
  useEffect(() => {
    if (!userId) return; // wait until userId is ready

    const socket = io("http://localhost:5500", { withCredentials: true });

    socket.emit("register", userId);
    console.log("🟢 Socket registered:", userId);

    socket.on("notification", (data: Notification) => {
      console.log("📬 New Notification received:", data);
      setNotificationList((prev) => [data, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // ✅ Mark as read when clicked
  const handleClickNotification = async (index: number) => {
    const notif = notificationList[index];
    setSelectId(index);
    setShowModal(true);

    if (!notif.read) {
      try {
        await markNotificationRead(notif._id);
        setNotificationList((prev) =>
          prev.map((n, i) => (i === index ? { ...n, read: true } : n))
        );
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  // ✅ Local-only delete for UI
  const handleDelete = (index: number) => {
    setNotificationList(notificationList.filter((_, i) => i !== index));
  };

  return (
    <Content>
      <h2>Notifications</h2>

      <NotificationList>
        {notificationList.length === 0 ? (
          <div>No notifications available.</div>
        ) : (
          notificationList.map((notification, index) => (
            <NotificationItem
              key={notification._id}
              onClick={() => handleClickNotification(index)}
              className={`flex items-center justify-between ${
                notification.read ? "opacity-70" : "opacity-100"
              }`}
            >
              <div>
                <NotificationDate>
                  {new Date(notification.createdAt).toLocaleString()}
                </NotificationDate>
                <NotificationMessage>
                  <b>{notification.title}</b> — {notification.message}
                </NotificationMessage>
              </div>
              <DeleteButton onClick={() => handleDelete(index)}>
                <FaTrash />
              </DeleteButton>
            </NotificationItem>
          ))
        )}
      </NotificationList>

      {/* Modal */}
      {showModal && selectId !== null && (
        <div className="fixed inset-0 bg-gray-500/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <div className="mb-3">
              <h3 className="text-lg font-semibold mb-2">
                {notificationList[selectId].title}
              </h3>
              <p>{notificationList[selectId].message}</p>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(
                  notificationList[selectId].createdAt
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </Content>
  );
};

export default SettingsPage;
