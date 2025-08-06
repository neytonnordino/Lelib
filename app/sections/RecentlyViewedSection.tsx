"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FaClock, FaEye } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface RecentlyViewedBook {
  bookId: string;
  viewedAt: string;
  viewCount: number;
}

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

export default function RecentlyViewedSection() {
  const { data: session, status } = useSession();
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedBook[]>(
    []
  );
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchRecentlyViewed();
    }
  }, [status]);

  useEffect(() => {
    if (recentlyViewed.length > 0) {
      fetchBookDetails();
    }
  }, [recentlyViewed]);

  const fetchRecentlyViewed = async () => {
    try {
      const response = await fetch("/api/recently-viewed?limit=6");
      if (response.ok) {
        const data = await response.json();
        setRecentlyViewed(data.recentlyViewed);
      }
    } catch (error) {
      console.error("Error fetching recently viewed:", error);
    }
  };

  const fetchBookDetails = async () => {
    setLoading(true);
    try {
      const bookPromises = recentlyViewed.map(async (item) => {
        const response = await fetch(
          `/api/books?q=${encodeURIComponent(item.bookId)}&maxResults=1`
        );
        if (response.ok) {
          const data = await response.json();
          return data.items?.[0] || null;
        }
        return null;
      });

      const bookResults = await Promise.all(bookPromises);
      const validBooks = bookResults.filter((book) => book !== null);
      setBooks(validBooks);
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status !== "authenticated") {
    return null;
  }

  // Show empty state if no recently viewed books
  if (recentlyViewed.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <FaClock className="text-2xl text-amber-500" />
            <h2 className="text-3xl font-bold text-gray-900">
              Recently Viewed
            </h2>
          </div>

          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <FaEye className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Recently Viewed Books
              </h3>
              <p className="text-gray-500 mb-6">
                Start exploring books to see your reading history here. Your
                recently viewed books will appear automatically.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
              >
                Explore Books
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FaClock className="text-2xl text-amber-500" />
            <h2 className="text-3xl font-bold text-gray-900">
              Recently Viewed
            </h2>
          </div>
          <Link
            href="/profile"
            className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {recentlyViewed.slice(0, 6).map((item, index) => {
              const book = books.find((b) => b.id === item.bookId);

              return (
                <motion.div
                  key={item.bookId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/book/${item.bookId}`}>
                    <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                      {book?.volumeInfo?.imageLinks?.thumbnail ? (
                        <Image
                          src={book.volumeInfo.imageLinks.thumbnail.replace(
                            "http://",
                            "https://"
                          )}
                          alt={book.volumeInfo.title}
                          width={200}
                          height={300}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <FaEye className="text-gray-400 text-2xl" />
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {book?.volumeInfo?.title || "Loading..."}
                      </h3>
                      {book?.volumeInfo?.authors && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                          by {book.volumeInfo.authors[0]}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
