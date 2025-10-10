"use client";

import { NavbarPrimary } from "@/presentation/components/navbar/navbar_primary";
import { useRouter, usePathname } from "next/navigation";
import { FaRegUserCircle, FaRegBell } from "react-icons/fa";
import { LuLockKeyhole, LuBookOpen } from "react-icons/lu";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <NavbarPrimary user={"seller"} showNotification={false} />
      <div className="min-h-screen bg-[#f3eee6] flex text-black">
        <aside className="w-76 p-6 bg-white rounded-r-xl shadow">
          <h2 className="text-xl font-semibold mb-6">Settings</h2>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => router.push("/sellersetting")}
              className={`flex items-center gap-2 text-black font-medium w-full text-left ${
                isActive("/sellersetting")
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
              aria-current={isActive("/sellersetting") ? "page" : undefined}
            >
              <FaRegUserCircle className="w-5 h-5" />
              <span>Account Preferences</span>
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/sellersetting/sellersettingNotification")
              }
              className={`flex items-center gap-2 w-full text-left ${
                isActive("/sellersetting/sellersettingNotification")
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
              aria-current={
                isActive("/sellersetting/sellersettingNotification")
                  ? "page"
                  : undefined
              }
            >
              <FaRegBell className="w-5 h-5" />
              <span>Notification</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/sellersetting/sellersettingPayment")}
              className={`flex items-center gap-2 text-black font-medium w-full text-left ${
                isActive("/sellersetting/sellersettingPayment")
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
              aria-current={
                isActive("/sellersetting/sellersettingPayment")
                  ? "page"
                  : undefined
              }
            >
              <LuLockKeyhole className="w-5 h-5" />
              <span>Payment & Security</span>
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/sellersetting/sellersettingPortfolio")
              }
              className={`flex items-center gap-2 w-full text-left ${
                isActive("/sellersetting/sellersettingPortfolio")
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-black"
              }`}
              aria-current={
                isActive("/sellersetting/sellersettingPortfolio")
                  ? "page"
                  : undefined
              }
            >
              <LuBookOpen className="w-5 h-5" />
              <span>Portfolio</span>
            </button>
          </div>
        </aside>

        {children}
      </div>
    </>
  );
}
