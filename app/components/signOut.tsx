"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { twMerge } from "tailwind-merge";

interface LogOutProps {
  className?: string;
}

const LogOut = ({ className }: LogOutProps) => {
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("SignOut error:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className={twMerge(
        "px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors",
        className
      )}
    >
      Sign Out
    </button>
  );
};

export default LogOut;
