"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaBook,
  FaSearch,
  FaHeart,
  FaUsers,
  FaRocket,
} from "react-icons/fa";

export default function AboutUs() {
  const features = [
    {
      icon: <FaSearch className="w-8 h-8" />,
      title: "Smart Search",
      description:
        "Discover your next favorite book with our intelligent search powered by Google Books API.",
    },
    {
      icon: <FaBook className="w-8 h-8" />,
      title: "Vast Library",
      description:
        "Access millions of books across all genres, from bestsellers to hidden gems.",
    },
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: "Personalized",
      description:
        "Get book recommendations tailored to your reading preferences and interests.",
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Community",
      description:
        "Join a community of book lovers and share your reading journey.",
    },
  ];

  const stats = [
    { number: "1M+", label: "Books Available" },
    { number: "50+", label: "Categories" },
    { number: "24/7", label: "Access" },
    { number: "Free", label: "Forever" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: <FaGithub className="w-6 h-6" />,
      url: "#", // Replace with your GitHub URL
      color: "hover:bg-gray-800",
    },
    {
      name: "Twitter",
      icon: <FaTwitter className="w-6 h-6" />,
      url: "#", // Replace with your Twitter URL
      color: "hover:bg-blue-500",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="w-6 h-6" />,
      url: "#", // Replace with your LinkedIn URL
      color: "hover:bg-blue-700",
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="w-6 h-6" />,
      url: "#", // Replace with your Instagram URL
      color: "hover:bg-pink-600",
    },
    {
      name: "YouTube",
      icon: <FaYoutube className="w-6 h-6" />,
      url: "#", // Replace with your YouTube URL
      color: "hover:bg-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20"></div>
        <div className="relative container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-full mb-8">
              <FaRocket className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-amber-500">Lelib</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your gateway to discovering amazing books. We believe every reader
              deserves to find their perfect story, and we&apos;re here to make
              that journey seamless and enjoyable.
            </p>
            <div className="flex justify-center">
              <Link
                href="/"
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Exploring
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              We&apos;re passionate about connecting readers with their next
              favorite book. By leveraging the power of Google Books API, we
              provide access to a vast library of titles, making book discovery
              effortless and enjoyable for everyone.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Lelib?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;ve built Lelib with readers in mind, offering features
              that make book discovery simple, fast, and enjoyable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-amber-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Developer Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Meet the Developer
            </h2>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12 mb-12">
              <div className="w-32 h-32 bg-amber-500 rounded-full mx-auto mb-8 flex items-center justify-center">
                <FaRocket className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                [Your Name Here]
              </h3>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                A passionate developer who loves books and technology. I created
                Lelib to solve the problem of finding great books and to share
                my love for reading with the world.
              </p>
              <p className="text-gray-600">
                Built with Next.js, TypeScript, Tailwind CSS, and the Google
                Books API.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Connect With Us
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Follow us on social media for updates, book recommendations, and
              more!
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${social.color}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            <div className="mt-12 p-6 bg-white rounded-xl shadow-lg">
              <p className="text-gray-600 mb-4">
                <strong>Note:</strong> Replace the &quot;#&quot; links above
                with your actual social media URLs:
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>• GitHub: Your GitHub profile or repository</p>
                <p>• Twitter: Your Twitter/X profile</p>
                <p>• LinkedIn: Your LinkedIn profile</p>
                <p>• Instagram: Your Instagram profile</p>
                <p>• YouTube: Your YouTube channel</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Discover Your Next Favorite Book?
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              Start exploring our vast collection of books today and find your
              next adventure.
            </p>
            <Link
              href="/"
              className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
            >
              Start Reading Journey
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
