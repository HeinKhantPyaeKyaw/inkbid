"use client";
import { useAuth } from "@/context/auth/AuthContext";
import {
  faBell,
  faChartLine,
  faCog,
  faPlus,
  faRightFromBracket,
  faScroll,
  faSheetPlastic,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {
  getNotifications,
  markNotificationRead,
} from "@/hooks/notification.api";
import { INavBarPrimaryProps } from "../../../interfaces/account/account.interface";

export const NavbarPrimary = ({
  user,
  userId,
  showNotification = true,
}: INavBarPrimaryProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔔 new state for notifications
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const { logout, user: authUser } = useAuth();
  const router = useRouter();
  const authUserId = authUser?.id ?? null;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // =============================
  // 🔔 Fetch unread notifications
  // =============================
  useEffect(() => {
    const fetchUnread = async () => {
      if (!authUserId) return;
      try {
        const res = await getNotifications({ unread: true });
        const data = res.items ?? res;
        setNotifications(data);
        setHasNew(data.length > 0);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchUnread();
  }, [authUserId]);

  // =============================
  // 🔔 Socket live updates
  // =============================
  useEffect(() => {
    if (!authUserId) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_BASE!, {
      transports: ["websocket"], // skip polling
      withCredentials: true,
    });

    socket.on("connect", () => {
      socket.emit("register", authUserId);
    });

    socket.on("disconnect", () => {
    });

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setHasNew(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [authUserId]);


  // =============================
  // Close dropdown on outside click
  // =============================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =============================
  // Mark as read + remove from list
  // =============================
  const handleNotificationClick = async (notifId: string, url?: string) => {
    try {
      await markNotificationRead(notifId);
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
      if (url) router.push(url);
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  // =============================
  // Your existing menu logic (unchanged)
  // =============================
  const dropdownItemsBuyer = (() => {
    const base = pathname.startsWith("/content")
      ? [
          {
            label: "Dashboard",
            icon: faSheetPlastic,
            href: "/dashboard/buyer-dashboard",
            indent: 1,
          },
          { label: "Settings", icon: faCog, href: "/buyersetting", indent: 2 },
          {
            label: "Log Out",
            icon: faRightFromBracket,
            action: handleLogout,
            indent: 3,
          },
        ]
      : pathname.startsWith("/buyersetting")
      ? [
          {
            label: "Products",
            icon: faScroll,
            href: "/content-listing",
            indent: 1,
          },
          {
            label: "Dashboard",
            icon: faSheetPlastic,
            href: "/dashboard/buyer-dashboard",
            indent: 2,
          },
          {
            label: "Log Out",
            icon: faRightFromBracket,
            action: handleLogout,
            indent: 3,
          },
        ]
      : pathname.startsWith("/dashboard/buyer-dashboard")
      ? [
          {
            label: "Products",
            icon: faScroll,
            href: "/content-listing",
            indent: 1,
          },
          { label: "Settings", icon: faCog, href: "/buyersetting", indent: 2 },
          {
            label: "Log Out",
            icon: faRightFromBracket,
            action: handleLogout,
            indent: 3,
          },
        ]
      : [
          {
            label: "Product",
            icon: faScroll,
            href: "/content-listing",
            indent: 1,
          },
          {
            label: "Dashboard",
            icon: faSheetPlastic,
            href: "/dashboard/buyer-dashboard",
            indent: 2,
          },
          { label: "Settings", icon: faCog, href: "/buyersetting", indent: 3 },
          {
            label: "Log Out",
            icon: faRightFromBracket,
            action: handleLogout,
            indent: 4,
          },
        ];

    return base;
  })();

  const dropdownItemsSeller = (() => {
    if (pathname.startsWith("/dashboard/seller")) {
      return [
        { label: "Create Post", icon: faPlus, href: "/create-post", indent: 1 },
        {
          label: "Profile",
          icon: faUser,
          href: `/profile/seller/${userId}`,
          indent: 2,
        },
        { label: "Settings", icon: faCog, href: "/sellersetting", indent: 3 },
        {
          label: "Log Out",
          icon: faRightFromBracket,
          action: handleLogout,
          indent: 4,
        },
      ];
    } else if (pathname.startsWith("/sellersetting")) {
      return [
        { label: "Create Post", icon: faPlus, href: "/create-post", indent: 1 },
        {
          label: "Profile",
          icon: faUser,
          href: `/profile/seller/${userId}`,
          indent: 2,
        },
        {
          label: "Dashboard",
          icon: faChartLine,
          href: "/dashboard/seller",
          indent: 3,
        },
        {
          label: "Log Out",
          icon: faRightFromBracket,
          action: handleLogout,
          indent: 4,
        },
      ];
    } else if (pathname.startsWith("/profile/seller")) {
      return [
        { label: "Create Post", icon: faPlus, href: "/create-post", indent: 1 },
        {
          label: "Dashboard",
          icon: faChartLine,
          href: "/dashboard/seller",
          indent: 2,
        },
        { label: "Settings", icon: faCog, href: "/sellersetting", indent: 3 },
        {
          label: "Log Out",
          icon: faRightFromBracket,
          action: handleLogout,
          indent: 4,
        },
      ];
    } else {
      return [
        {
          label: "Dashboard",
          icon: faChartLine,
          href: "/dashboard/seller",
          indent: 1,
        },
        {
          label: "Profile",
          icon: faUser,
          href: `/profile/seller/${userId}`,
          indent: 2,
        },
        { label: "Settings", icon: faCog, href: "/sellersetting", indent: 3 },
        {
          label: "Log Out",
          icon: faRightFromBracket,
          action: handleLogout,
          indent: 4,
        },
      ];
    }
  })();

  return (
    <nav className="flex items-center justify-between px-6 bg-primary">
      <div className="w-32" />
      <div className={`text-[64px] tracking-wide font-Forum text-accent ${user === "buyer" ? "cursor-pointer" : ""}`} onClick={() => user==="buyer" && router.push("/content-listing")}>
        INKBID
      </div>

      <div className="flex items-center gap-8">
        {/* 🔔 Notification Bell */}
        {showNotification && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifDropdown((prev) => !prev);
                setHasNew(false);
              }}
              className="relative"
            >
              <FontAwesomeIcon
                icon={faBell}
                className="text-accent text-[32px]"
              />
              {hasNew && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-lg z-50 p-4 max-h-96 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-2">
                  Unread Notifications
                </h3>
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No unread notifications 🎉
                  </p>
                ) : (
                  <ul>
                    {notifications.map((n) => (
                      <li
                        key={n._id}
                        onClick={() =>
                          handleNotificationClick(n._id, n.target?.url)
                        }
                        className="p-2 mb-2 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* 👤 User menu dropdown (UNCHANGED) */}
        <div className="relative">
          <button onClick={() => setShowDropdown((prev) => !prev)}>
            <FontAwesomeIcon
              icon={faUser}
              className="text-accent text-[32px]"
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 rounded-lg z-50 py-2">
              {user === "buyer"
                ? dropdownItemsBuyer.map((item, index) =>
                    item.action ? (
                      <button
                        key={index}
                        onClick={item.action}
                        className={`flex items-center justify-start gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition
                          ${
                            item.indent === 1
                              ? "ml-14"
                              : item.indent === 2
                              ? "ml-10 mr-2"
                              : item.indent === 3
                              ? "ml-6 mr-6"
                              : "mr-10 ml-2"
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="text-gray-600"
                        />
                        <span className="text-gray-800">{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        key={item.href || index}
                        href={item.href!}
                        className={`flex items-center justify-start gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition
                          ${
                            item.indent === 1
                              ? "ml-14"
                              : item.indent === 2
                              ? "ml-10 mr-2"
                              : item.indent === 3
                              ? "ml-6 mr-6"
                              : "mr-10 ml-2"
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="text-gray-600"
                        />
                        <span className="text-gray-800">{item.label}</span>
                      </Link>
                    )
                  )
                : dropdownItemsSeller.map((item, index) =>
                    item.action ? (
                      <button
                        key={index}
                        onClick={item.action}
                        className={`flex items-center justify-start gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition
                          ${
                            item.indent === 1
                              ? "ml-14"
                              : item.indent === 2
                              ? "ml-10 mr-2"
                              : item.indent === 3
                              ? "ml-6 mr-6"
                              : "mr-10 ml-2"
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="text-gray-600"
                        />
                        <span className="text-gray-800">{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-start gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition
                          ${
                            item.indent === 1
                              ? "ml-14"
                              : item.indent === 2
                              ? "ml-10 mr-2"
                              : item.indent === 3
                              ? "ml-6 mr-6"
                              : "mr-10 ml-2"
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="text-gray-600"
                        />
                        <span className="text-gray-800">{item.label}</span>
                      </Link>
                    )
                  )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
