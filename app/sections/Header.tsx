"use client"


import Link from "next/link";
import Image from "next/image";
import React from "react";
import { IoMdSearch } from "react-icons/io";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { Session } from "inspector/promises";
import { useSession } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();
  console.log(Session.us)
  return (
    <header className="px-6 py-2">
      <div className=" flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/mainIcon.png"
            width={80}
            height={80}
            alt="Lelib Icon"
          />
          <h1 className="text-2xl">Lelib</h1>
        </Link>
        <div className="flex items-center bg-neutral-200 rounded-3xl h-full text-neutral-600  py-2 px-4">
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
        </div>
        <div>
          <Button>
            <Link href="/sign">Log in</Link>
          </Button>
          <Avatar/>
        </div>
      </div>
    </header>
  );
};

export default Header;
