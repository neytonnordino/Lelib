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
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import NavLinks from "../components/NavLinks";

const Header = () => {
  const { data: session } = useSession();
  const [value, setvalue] = useState("");
  const [modal, setModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full px-6 py-2 bg-white border-b border-neutral-200">
      <div className="flex justify-between items-center gap-2">
        <Logo />
        <div className="hidden md:inline-flex">
          <SearchBar value={value} onChange={setvalue} />
        </div>
        <NavLinks className="hidden lg:inline-flex" />
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
              <SearchBar value={value} onChange={setvalue} />
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
                <Logo showText={false} />
                <div className="flex flex-col items-end px-6 gap-6">
                  <NavLinks
                    isMobile={true}
                    className="lg:hidden flex flex-col gap-4"
                    onMobileItemClick={() => setMenuOpen(false)}
                  />
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
