"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSearch,
  faFilter,
  faArrowDownWideShort,
  faUser,
  faSheetPlastic,
  faCog,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { getNotifications } from "@/hooks/notification.api";
import { useAuth } from "@/context/auth/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NavbarSecondary() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const userId = user?.id;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    genre: "",
    rating: "",
    sort: "",
  });
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filterRef = useRef<HTMLDivElement | null>(null);
  const bellRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  /* -------------------------------------------------------------------------- */
  /* 🔔 SOCKET NOTIFICATIONS */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!userId) return;

    const socket: Socket = io(
      process.env.NEXT_PUBLIC_API_BASE?.replace("/api/v1", "") ?? "",
      { withCredentials: true }
    );

    socket.emit("register", userId);
    socket.on("notification", (data) => {
      console.log("📬 New notification:", data);
      setNotifications((prev) => [data, ...prev]);
      setHasNew(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await getNotifications();
        setNotifications(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    }
    fetchUnread();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* 🧭 CLOSE DROPDOWNS ON OUTSIDE CLICK */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------------------------------------------------------------- */
  /* 🔍 SEARCH SUBMIT */
  /* -------------------------------------------------------------------------- */
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams({
      q: searchQuery,
      genre: selectedFilters.genre,
      rating: selectedFilters.rating,
      sort: selectedFilters.sort,
      dir: sortDirection,
    });
    router.push(`/content-listing?${params.toString()}`);
    setShowFilterDropdown(false);
  };

  /* -------------------------------------------------------------------------- */
  /* 🎚️ FILTER OPTIONS */
  /* -------------------------------------------------------------------------- */
  const filterOptions = {
    genre: ["Business", "Culture", "Health", "Politics", "Tech"],
    rating: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
    sort: ["highest_bid", "buy_now", "ends_in"],
  };

  const handleFilterSelect = (filterType: string, value: string) => {
    if (filterType === "sort") {
      setSelectedFilters((prev) => ({ ...prev, sort: value }));
      setSortDirection((prev) =>
        selectedFilters.sort === value
          ? prev === "asc"
            ? "desc"
            : "asc"
          : "desc"
      );
    } else {
      setSelectedFilters((prev) => ({ ...prev, [filterType]: value }));
    }
  };

  const handleClearFilters = () => {
    setSelectedFilters({ genre: "", rating: "", sort: "" });
    setSortDirection("desc");
    router.push("/content-listing");
    setShowFilterDropdown(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const dropdownItemsBuyer = [
    {
      label: "Dashboard",
      icon: faSheetPlastic,
      href: "/dashboard/buyer-dashboard",
    },
    { label: "Settings", icon: faCog, href: "/buyersetting" },
    {
      label: "Log Out",
      icon: faRightFromBracket,
      action: handleLogout,
    },
  ];

  /* -------------------------------------------------------------------------- */
  /* 🌈 UI */
  /* -------------------------------------------------------------------------- */
  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-primary shadow-md relative">
      {/* Left: Logo */}
      <div className="text-4xl font-Forum text-accent">INKBID</div>

      {/* Middle: Search + Filter */}
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full max-w-2xl bg-white rounded-full shadow-md px-4 py-2 relative"
      >
        <FontAwesomeIcon icon={faSearch} className="text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Search articles..."
          className="flex-grow ml-3 outline-none text-gray-700 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setShowFilterDropdown((prev) => !prev)}
            className="ml-3 px-4 py-2 bg-white text-primary rounded-full border border-gray-300 hover:bg-accent transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFilter} />
            <FontAwesomeIcon icon={faArrowDownWideShort} className="text-sm" />
          </button>

          {showFilterDropdown && (
            <div
              className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl p-5 z-50 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-primary mb-3">
                Filters
              </h3>
              {Object.entries(filterOptions).map(([key, values]) => (
                <div key={key} className="mb-4">
                  <h4 className="font-semibold text-gray-700 capitalize mb-1">
                    {key}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {values.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleFilterSelect(key, val)}
                        className={`px-3 py-1 rounded-full border text-sm ${
                          selectedFilters[
                            key as keyof typeof selectedFilters
                          ] === val
                            ? "bg-primary text-white border-primary"
                            : "border-gray-300 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {val}
                        {key === "sort" &&
                          selectedFilters.sort === val &&
                          (sortDirection === "asc" ? " ▲" : " ▼")}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* ✅ Clear & Apply buttons */}
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-accent transition"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setHasNew(false);
            }}
            className="relative text-white text-2xl"
          >
            <FontAwesomeIcon icon={faBell} />
            {hasNew && (
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl p-3 z-50 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-semibold text-primary mb-3">Notifications</h3>
              {Array.isArray(notifications) && notifications.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {notifications.map((noti) => (
                    <li
                      key={noti._id}
                      className="py-2 px-2 hover:bg-gray-50 cursor-pointer rounded transition"
                      onClick={() =>
                        router.push(
                          noti.target?.url || "/dashboard/buyer-dashboard"
                        )
                      }
                    >
                      <p className="font-semibold text-gray-800">
                        {noti.title}
                      </p>
                      <p className="text-gray-600 text-sm">{noti.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(noti.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No unread notifications</p>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileDropdown((prev) => !prev)}
            className="text-white text-2xl"
          >
            <FontAwesomeIcon icon={faUser} />
          </button>

          {showProfileDropdown && (
            <motion.div
              className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl p-3 z-50 border border-gray-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {dropdownItemsBuyer.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  {item.action ? (
                    <button
                      onClick={item.action}
                      className="flex items-center w-full gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition"
                    >
                      <FontAwesomeIcon icon={item.icon} />
                      <span>{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition"
                    >
                      <FontAwesomeIcon icon={item.icon} />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
}
