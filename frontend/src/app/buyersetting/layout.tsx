"use client";
import { NavbarPrimary } from "@/presentation/components/navbar/navbar_primary";
<<<<<<< HEAD
import { Bell, UserCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
=======
import { useRouter, usePathname } from "next/navigation";
import { FaBell, FaUserCircle } from "react-icons/fa";
>>>>>>> 🐽TestMerge

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
<<<<<<< HEAD
  console.log(pathname);
=======
>>>>>>> 🐽TestMerge

  const isActive = (path: string) => pathname === path;

  return (
    <>
<<<<<<< HEAD
      <NavbarPrimary isDisableNoti={true} />
=======
      <NavbarPrimary user={"buyer"} showNotification={false} />
>>>>>>> 🐽TestMerge
      <div className="min-h-screen bg-[#f3eee6] flex text-black">
        <aside className="w-64 p-6 bg-white rounded-r-xl shadow">
          <h2 className="text-xl font-semibold mb-6">Settings</h2>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => router.push("/buyersetting")}
              className={`flex items-center gap-2 text-black font-medium w-full text-left ${
                isActive("/buyersetting")
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
              aria-current={isActive("/buyersetting") ? "page" : undefined}
            >
<<<<<<< HEAD
              <UserCircle className="w-5 h-5" />
=======
              <FaUserCircle className="w-5 h-5" />
>>>>>>> 🐽TestMerge
              <span>Account Settings</span>
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/buyersetting/buyersettingNotification")
              }
              className={`flex items-center gap-2 w-full text-left ${
                isActive("/buyersetting/buyersettingNotification")
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
              aria-current={
                isActive("/buyersetting/buyersettingNotification")
                  ? "page"
                  : undefined
              }
            >
<<<<<<< HEAD
              <Bell className="w-5 h-5" />
=======
              <FaBell className="w-5 h-5" />
>>>>>>> 🐽TestMerge
              <span>Notification</span>
            </button>
          </div>
        </aside>

        {children}
      </div>
    </>
  );
}
