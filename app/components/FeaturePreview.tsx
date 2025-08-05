"use client";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FaBookOpen,
  FaStar,
  FaList,
  FaClock,
  FaSignInAlt,
  FaHeart,
  FaUsers,
  FaChartLine,
  FaBookmark,
  FaEye,
} from "react-icons/fa";

const features = [
  {
    id: "progress",
    title: "Reading Progress Tracker",
    description:
      "Track your reading journey with page-by-page progress, reading notes, and completion status.",
    icon: FaBookOpen,
    color: "from-blue-500 to-blue-600",
    preview: {
      title: "The Great Gatsby",
      progress: 75,
      currentPage: 150,
      totalPages: 200,
      status: "In Progress",
    },
  },
  {
    id: "reviews",
    title: "Book Reviews & Ratings",
    description:
      "Share your thoughts, rate books, and discover what others think about your favorite reads.",
    icon: FaStar,
    color: "from-yellow-500 to-yellow-600",
    preview: {
      rating: 4.5,
      reviewCount: 127,
      sampleReview:
        "A masterpiece of American literature that captures the essence of the Jazz Age.",
    },
  },
  {
    id: "lists",
    title: "Reading Lists & Collections",
    description:
      "Create custom reading lists, organize your library, and share recommendations with others.",
    icon: FaList,
    color: "from-green-500 to-green-600",
    preview: {
      listName: "Summer Reading 2024",
      bookCount: 12,
      followers: 8,
      isPublic: true,
    },
  },
  {
    id: "recent",
    title: "Recently Viewed Books",
    description:
      "Never lose track of books you've explored. Your reading history, always at your fingertips.",
    icon: FaClock,
    color: "from-purple-500 to-purple-600",
    preview: {
      recentCount: 5,
      lastViewed: "2 hours ago",
    },
  },
];

export default function FeaturePreview() {
  const { data: session, status } = useSession();

  // Don't show if user is already signed in
  if (status === "authenticated") {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Your Reading Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sign in to access powerful features that will transform how you
            discover, track, and share your reading journey.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Feature Header */}
              <div
                className={`bg-gradient-to-r ${feature.color} p-6 text-white`}
              >
                <div className="flex items-center justify-between">
                  <feature.icon className="text-3xl" />
                  <div className="text-right">
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                  </div>
                </div>
              </div>

              {/* Feature Content */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">
                  {feature.description}
                </p>

                {/* Preview Content */}
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                  {feature.id === "progress" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">
                          {feature.preview.title}
                        </span>
                        <span className="text-gray-500">
                          {feature.preview.status}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${feature.preview.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        Page {feature.preview.currentPage} of{" "}
                        {feature.preview.totalPages}
                      </div>
                    </div>
                  )}

                  {feature.id === "reviews" && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.floor(feature.preview.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {feature.preview.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({feature.preview.reviewCount} reviews)
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 italic">
                        "{feature.preview.sampleReview}"
                      </p>
                    </div>
                  )}

                  {feature.id === "lists" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {feature.preview.listName}
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <FaUsers className="w-3 h-3" />
                          <span>{feature.preview.followers}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">
                          {feature.preview.bookCount} books
                        </span>
                        <span className="text-green-600 font-medium">
                          {feature.preview.isPublic ? "Public" : "Private"}
                        </span>
                      </div>
                    </div>
                  )}

                  {feature.id === "recent" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          Recently Viewed
                        </span>
                        <FaEye className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>
                          {feature.preview.recentCount} books in history
                        </div>
                        <div>Last viewed: {feature.preview.lastViewed}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-8 shadow-lg">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Transform Your Reading Experience?
              </h3>
              <p className="text-amber-100 mb-6 text-lg">
                Join thousands of readers who are already tracking their
                progress, sharing reviews, and discovering amazing books with
                our powerful features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signin"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <FaSignInAlt className="mr-2" />
                  Sign In Now
                </Link>
                <Link
                  href="/about-us"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-amber-600 transition-colors duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
