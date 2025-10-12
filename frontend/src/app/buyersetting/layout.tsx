"use client";
import { NavbarPrimary } from "@/presentation/components/navbar/navbar_primary";
import { useRouter, usePathname } from "next/navigation";
import { FaBell, FaUserCircle } from "react-icons/fa";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <NavbarPrimary user={"buyer"} showNotification={false} />
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
              <FaUserCircle className="w-5 h-5" />
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
              <FaBell className="w-5 h-5" />
              <span>Notification</span>
            </button>
          </div>
        </aside>

        {children}
      </div>
    </>
  );
}
