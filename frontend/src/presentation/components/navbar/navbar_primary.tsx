"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faSheetPlastic,
  faCog,
  faChartLine,
  faScroll,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { INavBarPrimaryProps } from "../../../interfaces/account/account.interface";

export const NavbarPrimary = ({user}: INavBarPrimaryProps) => {
  //---------------------
  //   CONST
  //---------------------
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();


  

  const dropdownItemsBuyer = (() => {
    const base = pathname.startsWith("/content")
      ? [
          {
            label: "Dashboard",
            icon: faSheetPlastic,
            href: "/dashboard",
            indent: 1,
          },
          { label: "Settings", icon: faCog, href: "/settings", indent: 2 },
        ]
      : pathname.startsWith("/settings")
      ? [
          {
            label: "Products",
            icon: faScroll,
            href: "/content",
            indent: 1,
          },
          {
            label: "Dashboard",
            icon: faSheetPlastic,
            href: "/dashboard",
            indent: 2,
          },
        ]
      : pathname.startsWith("/dashboard")
      ? [
          {
            label: "Product",
            icon: faScroll,
            href: "/content",
            indent: 1,
          },
          { label: "Settings", icon: faCog, href: "/settings", indent: 1 },
        ]
      : [
          {
            label: "Product",
            icon: faScroll,
            href: "/content",
            indent: 1,
          },
          {
            label: "Dashboard",
            icon: faSheetPlastic,
            href: "/dashboard",
            indent: 2,
          },
          { label: "Settings", icon: faCog, href: "/settings", indent: 3 },
        ];

    return base;
  })();

  const dropdownItemsSeller = (() => {
    const base = pathname.startsWith("/dashboard")
      ? [
          {
            label: "Profile",
            icon: faUser,
            href: "/profile",
            indent: 1,
          },
          { label: "Settings", icon: faCog, href: "/settings", indent: 2 },
        ]
      : pathname.startsWith("/settings")
      ? [
          {
            label: "Profile",
            icon: faUser,
            href: "/profile",
            indent: 1,
          },
          {
            label: "Dashboard",
            icon: faChartLine,
            href: "/dashboard",
            indent: 2,
          },
        ]
      : pathname.startsWith("/profile")
      ? [
          {
            label: "Dashboard",
            icon: faChartLine,
            href: "/dashboard",
            indent: 1,
          },
          { label: "Settings", icon: faCog, href: "/settings", indent: 2 },
        ]
      : [
          {
            label: "Dashboard",
            icon: faChartLine,
            href: "/dashboard",
            indent: 1,
          },
          {
            label: "Log Out",
            icon: faRightFromBracket,
            href: "/logout",
            indent: 2,
          },
        ];
    return base;
  })();
  //---------------------
  //   HANDLE
  //---------------------

  //---------------------
  //   RENDER
  //---------------------
  return (
    <nav className="flex items-center justify-between px-6 bg-primary">
      <div className="w-32" />
      <div className="text-[64px] tracking-wide font-Forum text-accent">
        INKBID
      </div>
      <div className="flex items-center gap-8">
        <button>
          <FontAwesomeIcon icon={faBell} className="text-accent text-[32px]" />
        </button>
        <div className="relative">
          <button onClick={() => setShowDropdown((prev) => !prev)}>
            <FontAwesomeIcon
              icon={faUser}
              className="text-accent text-[32px]"
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-48 rounded-lg z-50 py-2">
              {user === "buyer"
                ? dropdownItemsBuyer.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition ${
                        item.indent === 1
                          ? "mr-2 ml-4"
                          : item.indent === 2
                          ? "mr-8"
                          : "mr-0 ml-8"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="text-gray-600"
                      />
                      <span className="text-gray-800">{item.label}</span>
                    </Link>
                  ))
                : dropdownItemsSeller.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition ${
                        item.indent === 1
                          ? "mr-2 ml-4"
                          : item.indent === 2
                          ? "mr-8"
                          : "mr-0 ml-8"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="text-gray-600"
                      />
                      <span className="text-gray-800">{item.label}</span>
                    </Link>
                  ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
