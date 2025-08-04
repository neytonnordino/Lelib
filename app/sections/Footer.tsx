"use client"

import React from "react";
import { navigationItems } from "../config/navigation";
import Logo from "../components/Logo";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-amber-300 to-amber-500 py-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center">
            <Logo showText={false} />
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center md:justify-center text-black  transition">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:scale-105 hover:-translate-y-1 hover:text-white/80 font-medium transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="text-sm text-neutral-900 text-center mt-5">
            &copy; 2025 Lelib, Inc. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
