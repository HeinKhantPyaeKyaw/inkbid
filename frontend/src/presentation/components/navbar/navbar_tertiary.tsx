"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export const NavbarTertiary = () => {
  //---------------------
  //   CONST
  //---------------------
  const router = useRouter();
  //---------------------
  //   HANDLE
  //---------------------

  //---------------------
  //   RENDER
  //---------------------
  return (
    <nav className="flex items-center justify-between px-6 ">
      <div className="w-1/20" />
      <div className="text-[50px] tracking-[10px] font-Forum text-accent">
        INKBID
      </div>
      <div className="flex items-center gap-8">
        <div className="relative">
          <button className="cursor-pointer hover:scale-110 transition-all duration-200" onClick={() => router.push("/profile")}>
            <FontAwesomeIcon
              icon={faUser}
              className="text-accent text-[32px]"
            />
          </button>
        </div>
      </div>
    </nav>
  );
};
