"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { IoEllipsisVertical } from "react-icons/io5";
import LogOut from "./signOut";
import Avatar from "./Avatar";

interface UserDropdownProps {
  className?: string;
}

const UserDropdown = ({ className }: UserDropdownProps) => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div
        className={twMerge(
          "animate-pulse rounded-3xl bg-gradient-to-r from-amber-300 to bg-amber-500 transition-colors duration-75 w-20 h-10",
          className
        )}
      ></div>
    );
  }

  if (!session) {
    return null;
  }

  const userName = session.user?.name || session.user?.email || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const userImage = session.user?.image;

  return (
    <div className={twMerge("relative", className)} ref={dropdownRef}>
      <div className="flex items-center gap-3">
        <Avatar>
          {userImage ? (
            <Image
              src={userImage}
              alt="Profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-amber-500 flex items-center justify-center text-white font-semibold rounded-full">
              {userInitial}
            </div>
          )}
        </Avatar>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="User options"
        >
          <IoEllipsisVertical className="text-gray-600 text-xl" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{session.user?.email}</p>
            </div>
            <div className="px-2 py-1">
              <LogOut className="w-full justify-center" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
