"use client";

import { useSession } from "next-auth/react";
import { useFavorites } from "../hooks/useFavorites";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "../components/FavoriteButton";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch book details for favorite book IDs
  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      if (favorites.length === 0) {
        setFavoriteBooks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const books: Book[] = [];

      for (const bookId of favorites) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${bookId}`
          );
          if (response.ok) {
            const book = await response.json();
            books.push(book);
          }
        } catch (error) {
          console.error(`Error fetching book ${bookId}:`, error);
        }
      }

      setFavoriteBooks(books);
      setLoading(false);
    };

    if (!favoritesLoading) {
      fetchFavoriteBooks();
    }
  }, [favorites, favoritesLoading]);

  if (status === "loading") {
    return (
      <div className="container mx-auto px-6 py-8 pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto px-6 py-8 pt-24">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to view your profile and favorites.
          </p>
          <Link
            href="/signin"
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {session?.user?.name || "User"}
              </h1>
              <p className="text-gray-600">{session?.user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              My Favorite Books
            </h2>
            <span className="text-gray-500">
              {favorites.length} {favorites.length === 1 ? "book" : "books"}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your favorites...</p>
            </div>
          ) : favoriteBooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start exploring books and add them to your favorites!
              </p>
              <Link
                href="/"
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteBooks.map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link href={`/book/${book.id}`}>
                    <div className="relative">
                      {book.volumeInfo.imageLinks?.thumbnail ? (
                        <Image
                          src={book.volumeInfo.imageLinks.thumbnail.replace(
                            "http://",
                            "https://"
                          )}
                          alt={book.volumeInfo.title}
                          width={300}
                          height={400}
                          className="w-full h-48 object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">No image</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <div onClick={(e) => e.preventDefault()}>
                          <FavoriteButton bookId={book.id} size="sm" />
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/book/${book.id}`}>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-amber-600 transition-colors">
                        {book.volumeInfo.title}
                      </h3>
                    </Link>
                    {book.volumeInfo.authors && (
                      <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                        by {book.volumeInfo.authors.join(", ")}
                      </p>
                    )}
                    {book.volumeInfo.averageRating && (
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="text-xs text-gray-500 ml-1">
                          {book.volumeInfo.averageRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 