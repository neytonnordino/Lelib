"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { IoMdSearch } from "react-icons/io";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { useSession } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className="px-6 py-2">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/mainIcon.png"
            width={80}
            height={80}
            alt="Lelib Icon"
          />
          <h1 className="text-2xl">Lelib</h1>
        </Link>
        <form className="flex items-center bg-neutral-200 rounded-3xl h-full text-neutral-600 py-2 px-4 cursor-pointer">
          <input type="text" placeholder="Search" className="outline-0 px-2" />
          <div className="flex justify-between items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="15"
              height="20"
              viewBox="0 0 50 50"
              className="font-bold"
            >
              <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
            </svg>
            <IoMdSearch className="text-xl" />
          </div>
        </form>
        <div className="flex items-center gap-4">
          {isLoading ? (
            // Show loading state to prevent hydration mismatch
            <div className="w-20 h-10 bg-gray-200 rounded animate-pulse"></div>
          ) : session ? (
            // User is logged in
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user?.name || session.user?.email}
              </span>
              <Avatar>
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                  </div>
                )}
              </Avatar>
            </div>
          ) : (
            // User is not logged in
            <Button>
              <Link href="/signin">Log in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
