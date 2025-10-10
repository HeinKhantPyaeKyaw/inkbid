"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { FaBell, FaCog, FaLock, FaUser } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

const Sidebar = styled.div`
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const SidebarItem = styled.div`
  padding: 10px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  &:hover {
    background-color: #ddd;
  }
`;

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

interface Notification {
  date: string;
  message: string;
}

const notifications: Notification[] = [
  {
    date: "Today",
    message:
      "We're pleased to inform you that you have successfully won the bid for 'The Haunting of...'",
  },
  {
    date: "Today",
    message:
      'Your recent bid on the article "The Haunting of Beverly Hills" has been outbid.',
  },
  {
    date: "Today",
    message:
      'Your recent bid on the article "The Haunting of Beverly Hills" has been outbid.',
  },
  {
    date: "Yesterday",
    message: 'Awaiting action for your article "Tumbling Rocks decline".',
  },
  {
    date: "18-Apr-2025",
    message:
      'Congratulations! The article "Peacocks on docks" has been purchased, you can find it in your portfolio.',
  },
];

const SettingsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("Notification");
  const [selectId, setSelectId] = useState<number | null>(null);
  const [notificationList, setNotificationList] = useState(notifications);
  const [showModal, setShowModal] = useState(false);

  return (
    <Content>
      <h2>{selectedTab}</h2>

      {selectedTab === "Notification" && (
        <NotificationList>
          {notificationList.map((notification, index) => (
            <NotificationItem
              onClick={() => {
                setShowModal(true);
                setSelectId(index);
              }}
              key={index}
              className="flex items-center justify-between"
            >
              <div>
                <NotificationDate>{notification.date}</NotificationDate>
                <NotificationMessage>
                  {notification.message}
                </NotificationMessage>
              </div>
              <DeleteButton
                onClick={() =>
                  setNotificationList(
                    notificationList.filter((_, i) => i !== index)
                  )
                }
              >
                <FaTrash />
              </DeleteButton>
            </NotificationItem>
          ))}
        </NotificationList>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <div className="mb-3">
              {selectId !== null && notificationList[selectId].message}
            </div>
          </div>
        </div>
      )}
    </Content>
  );
};

export default SettingsPage;
