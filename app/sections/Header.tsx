"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { useSession } from "next-auth/react";
import LogOut from "../components/signOut";
import { RxExit } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Categories",
    href: "#categories",
  },
  {
    label: "Discover",
    href: "#discover",
  },

  {
    label: "Read",
    href: "#read",
  },

  {
    label: "About us",
    href: "/about-us",
  },
];

const Header = () => {
  const { data: session, status } = useSession();
  const [value, setvalue] = useState("");
  const [modal, setModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="px-6 py-2">
      <div className="flex justify-between items-center gap-2">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/mainIcon.png"
            width={80}
            height={80}
            alt="Lelib Icon"
          />
          <h1 className="text-base md:text-2xl bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            Lelib
          </h1>
        </Link>
        <div className="hidden md:inline-flex">
          <form className="flex items-center justify-between bg-neutral-200 rounded-3xl h-full  text-neutral-600 py-2 px-4 cursor-pointer transition-all duration-300 lg:w-80">
            <input
              type="text"
              placeholder="Search"
              value={value}
              onChange={(e) => setvalue(e.target.value)}
              className="outline-0 px-2 w-full"
            />
            <div className="flex justify-between items-center gap-1">
              {value && (
                <button onClick={() => setvalue("")} className="cursor-pointer">
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
                </button>
              )}
              <IoMdSearch className="text-xl" />
            </div>
          </form>
        </div>
        <nav className="hidden lg:inline-flex">
          <ul className="flex items-center gap-2">
            {navItems.map((item) => (
              <li
                key={item.label}
                className={`hover:text-amber-300 transition-colors ${
                  pathname === item.href ? " border-b-2 border-amber-300" : ""
                }`}
              >
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex gap-2 transition items-center">
          <Button
            variant={"tertiary"}
            className="bg-neutral-100 hover:bg-neutral-200 md:hidden border-0 transition hover:scale-90 group"
            onClick={() => setModal(true)}
          >
            <IoMdSearch className="text-2xl group-hover:text-amber-400 transition" />
          </Button>
          {/* Modal Overlay */}
          <div
            className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-all duration-300 ease-in-out ${
              modal
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setModal(false)}
          >
            <RxExit className="absolute top-20 text-white text-2xl right-5 cursor-pointer hover:text-gray-300 transition-colors duration-200" />
            <div
              className={`transform transition-all duration-300 ease-out ${
                modal ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <form className="flex items-center justify-between bg-neutral-200 rounded-3xl h-10 w-70 text-neutral-600 py-2 px-4 cursor-pointer">
                <input
                  type="text"
                  placeholder="Search"
                  className="outline-0 px-2"
                  value={value}
                  onChange={(e) => setvalue(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setvalue("")}
                    className={`cursor-pointer transition ${
                      value ? "opacity-100" : "opacity-0"
                    }`}
                  >
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
                  </button>
                  <IoMdSearch className="text-xl" />
                </div>
              </form>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
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
                    <div className="w-10 h-10 bg-amber-500 flex items-center justify-center text-white font-semibold">
                      {session.user?.name?.[0] ||
                        session.user?.email?.[0] ||
                        "U"}
                    </div>
                  )}
                </Avatar>
                <LogOut />
              </div>
            ) : (
              // User is not logged in
              <Button className="bg-gradient-to-r from-amber-200 to-amber-500 hover:bg-gradient-to-l  hover:scale-95 transition-all ease-in-out duration-200 hidden md:inline-flex">
                <Link
                  href="/signin"
                  className="text-[12px] md:text-base whitespace-nowrap"
                >
                  Log in
                </Link>
              </Button>
            )}
          </div>

          {/* { menu mobile } */}
          <button
            aria-label="Toggle Menu"
            className="lg:hidden z-[60]"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`feather feather-menu text-black hover:text-amber-300`}
            >
              <line
                x1="3"
                y1="6"
                x2="21"
                y2="6"
                className={twMerge(
                  "origin-left transition-all duration-300",
                  menuOpen && "rotate-45 -translate-y-1"
                )}
              />
              <line
                x1="3"
                y1="12"
                x2="21"
                y2="12"
                className={twMerge(
                  "transition-all duration-300",
                  menuOpen && "opacity-0"
                )}
              />
              <line
                x1="3"
                y1="18"
                x2="21"
                y2="18"
                className={twMerge(
                  "origin-left transition-all duration-300",
                  menuOpen && "-rotate-45 translate-y-1"
                )}
              />
            </svg>
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed inset-0 bg-default z-40 px-6 py-2 lg:hidden overflow-y-auto bg-white text-black"
              >
                <Link href="/" className="flex items-center">
                  <Image
                    src="/images/mainIcon.png"
                    width={80}
                    height={0}
                    alt="Lelib Icon"
                  />
                </Link>
                <div className="flex flex-col items-end px-6 gap-6">
                  <nav className="lg:hidden ">
                    <ul className="flex flex-col items-end gap-6 ">
                      {navItems.map((item) => (
                        <li
                          key={item.label}
                          className={`hover:text-amber-300 transition-colors ${
                            pathname === item.href
                              ? " border-b-2 border-amber-300 "
                              : ""
                          }`}
                        >
                          <Link href={item.href}>{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <Button className="bg-gradient-to-r from-amber-200 to-amber-500 hover:bg-gradient-to-l  hover:scale-95 transition-all ease-in-out duration-200 lg:hidden px-8">
                    <Link
                      href="/signin"
                      className="text-[12px] md:text-base whitespace-nowrap"
                    >
                      Log in
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
