"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useBookSearch } from "../hooks/useBookSearch";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import FavoriteButton from "../components/FavoriteButton";
import ReactMarkdown from "react-markdown";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { books, loading, error, totalItems, searchBooks } = useBookSearch();
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (query) {
      searchBooks(query, 0);
      setCurrentPage(0);
      setHasMore(true);
    }
  }, [query, searchBooks]);

  const loadMore = async () => {
    if (!hasMore || loading) return;

    const nextPage = currentPage + 1;
    const startIndex = nextPage * 20;

    if (startIndex >= totalItems) {
      setHasMore(false);
      return;
    }

    await searchBooks(query, startIndex);
    setCurrentPage(nextPage);
  };

  if (loading && books.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for books...</p>
        </div>
      </div>
    );
  }

  if (error && books.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Search Results
          </h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-gray-600">
          {totalItems > 0 ? `${totalItems} books found` : "No books found"}
        </p>
      </div>

      {books.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/book/${book.id}`}>
                <div className="aspect-[3/4] relative overflow-hidden">
                  {book.volumeInfo.imageLinks?.thumbnail ? (
                    <Image
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={book.volumeInfo.title}
                      width={200}
                      height={266}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 z-10">
                    <div onClick={(e) => e.preventDefault()}>
                      <FavoriteButton bookId={book.id} size="sm" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {book.volumeInfo.title}
                  </h3>
                  {book.volumeInfo.authors && (
                    <p className="text-sm text-gray-600 mb-2">
                      by {book.volumeInfo.authors.join(", ")}
                    </p>
                  )}
                  {book.volumeInfo.description && (
                    <div className="text-sm text-gray-500 line-clamp-3 prose prose-sm max-w-none">
                      <ReactMarkdown>
                        {book.volumeInfo.description}
                      </ReactMarkdown>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    {book.volumeInfo.averageRating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600">
                          {book.volumeInfo.averageRating.toFixed(1)}
                        </span>
                        {book.volumeInfo.ratingsCount && (
                          <span className="text-xs text-gray-400">
                            ({book.volumeInfo.ratingsCount})
                          </span>
                        )}
                      </div>
                    )}
                    {book.volumeInfo.publishedDate && (
                      <span className="text-xs text-gray-400">
                        {new Date(book.volumeInfo.publishedDate).getFullYear()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {hasMore && books.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {!hasMore && books.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-500">No more books to load</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
