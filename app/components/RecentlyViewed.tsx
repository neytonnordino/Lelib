"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FaClock, FaTrash, FaEye } from "react-icons/fa";
import Link from "next/link";

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
    description?: string;
  };
}

interface RecentlyViewedProps {
  limit?: number;
  className?: string;
}

export default function RecentlyViewed({
  limit = 5,
  className = "",
}: RecentlyViewedProps) {
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
      const response = await fetch(`/api/recently-viewed?limit=${limit}`);
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

  const clearRecentlyViewed = async () => {
    if (!session?.user?.email) return;

    if (
      !confirm("Are you sure you want to clear your recently viewed history?")
    )
      return;

    setLoading(true);
    try {
      const response = await fetch("/api/recently-viewed", {
        method: "DELETE",
      });

      if (response.ok) {
        setRecentlyViewed([]);
        setBooks([]);
      }
    } catch (error) {
      console.error("Error clearing recently viewed:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeBook = async (bookId: string) => {
    if (!session?.user?.email) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/recently-viewed?bookId=${bookId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchRecentlyViewed();
      }
    } catch (error) {
      console.error("Error removing book:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FaClock className="text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Recently Viewed
          </h3>
        </div>
        {recentlyViewed.length > 0 && (
          <button
            onClick={clearRecentlyViewed}
            disabled={loading}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <FaTrash />
            Clear All
          </button>
        )}
      </div>

      {loading && recentlyViewed.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex gap-4 animate-pulse">
              <div className="w-16 h-24 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : recentlyViewed.length === 0 ? (
        <div className="text-center py-8">
          <FaEye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recently viewed books</p>
          <p className="text-sm text-gray-400 mt-1">
            Start browsing books to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentlyViewed.map((item, index) => {
            const book = books.find((b) => b.id === item.bookId);

            return (
              <motion.div
                key={item.bookId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  {book?.volumeInfo?.imageLinks?.thumbnail ? (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                      className="w-16 h-24 object-cover rounded shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center">
                      <FaEye className="text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/book/${item.bookId}`}
                        className="block hover:text-blue-600 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900 truncate">
                          {book?.volumeInfo?.title || "Loading..."}
                        </h4>
                      </Link>

                      {book?.volumeInfo?.authors && (
                        <p className="text-sm text-gray-600 truncate">
                          by {book.volumeInfo.authors.join(", ")}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Viewed {formatDate(item.viewedAt)}</span>
                        {item.viewCount > 1 && (
                          <span>{item.viewCount} times</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeBook(item.bookId)}
                      disabled={loading}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Remove from recently viewed"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {recentlyViewed.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link
            href="/profile"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            View all recently viewed books →
          </Link>
        </div>
      )}
    </div>
  );
}
