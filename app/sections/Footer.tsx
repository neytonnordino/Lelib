"use client";

import React from "react";
import { navigationItems } from "../config/navigation";
import Logo from "../components/Logo";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FaBook,
  FaBookOpen,
  FaBookmark,
  FaGraduationCap,
  FaHeart,
  FaStar,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.8]);

  const floatingIcons = [
    { icon: FaBook, delay: 0, size: "text-2xl" },
    { icon: FaBookOpen, delay: 0.2, size: "text-xl" },
    { icon: FaBookmark, delay: 0.4, size: "text-lg" },
    { icon: FaGraduationCap, delay: 0.6, size: "text-xl" },
    { icon: FaHeart, delay: 0.8, size: "text-lg" },
    { icon: FaStar, delay: 1, size: "text-2xl" },
  ];

  const socialLinks = [
    {
      icon: FaGithub,
      href: "#",
      label: "GitHub",
      color: "hover:text-gray-800",
    },
    {
      icon: FaTwitter,
      href: "#",
      label: "Twitter",
      color: "hover:text-amber-500",
    },
    {
      icon: FaLinkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:text-amber-700",
    },
    {
      icon: FaInstagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-600",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 py-16 overflow-hidden">
      {/* Floating Book Icons Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              y: [-10, 10, -10],
              x: [-5, 5, -5],
            }}
            transition={{
              duration: 4 + index * 0.5,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute text-amber-600/30 ${item.size}`}
            style={{
              left: `${10 + index * 15}%`,
              top: `${20 + (index % 2) * 30}%`,
            }}
          >
            <item.icon />
          </motion.div>
        ))}
      </div>

      {/* Main Footer Content */}
      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-6 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo Section */}
          <motion.div
            className="flex items-center justify-center mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Logo showText={false} />
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            className="flex flex-col md:flex-row gap-6 items-center md:justify-center text-black mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <Link
                  href={item.href}
                  className="hover:text-white font-medium transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-amber-600/20"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex justify-center gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                className={`text-amber-800 hover:text-white transition-colors duration-300 ${social.color}`}
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                aria-label={social.label}
              >
                <social.icon className="text-2xl" />
              </motion.a>
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div
            className="w-32 h-1 bg-amber-600 mx-auto mb-8 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          />

          {/* Copyright */}
          <motion.p
            className="text-sm text-amber-900 text-center font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            &copy; 2025 Lelib, Inc. All rights reserved.
          </motion.p>

          {/* Additional Info */}
          <motion.div
            className="mt-4 text-xs text-amber-800/80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            viewport={{ once: true }}
          >
            <p>Discover your next favorite book with our intelligent search</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-amber-600"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-amber-600"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-amber-600"
          />
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
