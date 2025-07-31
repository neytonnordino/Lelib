"use client";

import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import Button from "../components/Button";
import { RxExit } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import NavLinks from "../components/NavLinks";
import UserSection from "../components/UserSection";
import { useScrollHeader } from "../hooks/useScrollHeader";

const Header = () => {
  const [value, setvalue] = useState("");
  const [modal, setModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isVisible } = useScrollHeader();

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 w-full px-6 bg-white/95 backdrop-blur-md border-b border-neutral-200 z-50 shadow-sm"
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -80 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <span className="absolute right-5 -bottom-1 text-green-600 animate-pulse duration-500">
          In development
        </span>
        <div className="flex justify-between items-center gap-2">
          <Logo />
          <div className="hidden md:inline-flex">
            <SearchBar value={value} onChange={setvalue} />
          </div>
          <NavLinks className="hidden lg:inline-flex" />
          <div className="flex gap-2 transition items-center">
            {/* Desktop User Section */}
            <div className="hidden lg:block">
              <UserSection />
            </div>

            <Button
              variant={"tertiary"}
              className="bg-neutral-100 hover:bg-neutral-200 md:hidden border-0 transition hover:scale-90 group mr-12"
              onClick={() => setModal(true)}
            >
              <IoMdSearch className="text-2xl group-hover:text-amber-400 transition" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Search Modal - Outside of header */}
      <div
        className={`fixed inset-0 bg-black/80 flex items-center justify-center z-[60] transition-all duration-300 ease-in-out ${
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

      {/* Mobile Menu Button - Always visible */}
      <button
        aria-label="Toggle Menu"
        className="lg:hidden fixed top-5 right-6 z-[75] bg-white/95 backdrop-blur-sm rounded-lg p-2  "
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`feather feather-menu text-black ${
            menuOpen && "text-amber-300"
          } hover:text-amber-300 transition-colors`}
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile Menu - Outside of header */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-white z-[65] px-6 py-2 lg:hidden overflow-y-auto text-black"
          >
            <Logo showText={false} />
            <div className="flex flex-col items-end px-6 gap-6">
              <NavLinks
                isMobile={true}
                className="lg:hidden flex flex-col gap-4"
                onMobileItemClick={() => setMenuOpen(false)}
              />
              <UserSection isMobile={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
