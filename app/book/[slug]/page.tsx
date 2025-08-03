"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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
    publisher?: string;
    language?: string;
    previewLink?: string;
    infoLink?: string;
  };
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const Slug = (props: Props) => {
  const [slug, setSlug] = useState<string>("");
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSlug = async () => {
      const { slug: slugParam } = await props.params;
      setSlug(slugParam);
    };
    getSlug();
  }, [props.params]);

  useEffect(() => {
    const fetchBook = async () => {
      if (!slug) return; // Don't fetch if slug is not set

      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${slug}`
        );
        if (!response.ok) {
          throw new Error("Book not found");
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load book");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-6 py-8 ">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Book Not Found
          </h1>
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            href="/"
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Link
          href="/"
          className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-lg">
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail.replace(
                      "http://",
                      "https://"
                    )}
                    alt={book.volumeInfo.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">
                      No image available
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {book.volumeInfo.title}
            </h1>

            {book.volumeInfo.authors && (
              <p className="text-xl text-gray-600 mb-6">
                by {book.volumeInfo.authors.join(", ")}
              </p>
            )}

            {/* Rating */}
            {book.volumeInfo.averageRating && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < Math.floor(book.volumeInfo.averageRating!)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">
                  {book.volumeInfo.averageRating.toFixed(1)}
                </span>
                {book.volumeInfo.ratingsCount && (
                  <span className="text-gray-500">
                    ({book.volumeInfo.ratingsCount.toLocaleString()} ratings)
                  </span>
                )}
              </div>
            )}

            {/* Book Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {book.volumeInfo.publishedDate && (
                <div>
                  <span className="font-semibold text-gray-700">
                    Published:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {new Date(book.volumeInfo.publishedDate).getFullYear()}
                  </span>
                </div>
              )}
              {book.volumeInfo.pageCount && (
                <div>
                  <span className="font-semibold text-gray-700">Pages:</span>
                  <span className="ml-2 text-gray-600">
                    {book.volumeInfo.pageCount.toLocaleString()}
                  </span>
                </div>
              )}
              {book.volumeInfo.publisher && (
                <div>
                  <span className="font-semibold text-gray-700">
                    Publisher:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {book.volumeInfo.publisher}
                  </span>
                </div>
              )}
              {book.volumeInfo.language && (
                <div>
                  <span className="font-semibold text-gray-700">Language:</span>
                  <span className="ml-2 text-gray-600">
                    {book.volumeInfo.language.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Categories */}
            {book.volumeInfo.categories && (
              <div className="mb-6">
                <span className="font-semibold text-gray-700">Categories:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {book.volumeInfo.categories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {book.volumeInfo.description && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.volumeInfo.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {book.volumeInfo.previewLink && (
                <a
                  href={book.volumeInfo.previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Preview Book
                </a>
              )}
              {book.volumeInfo.infoLink && (
                <a
                  href={book.volumeInfo.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  More Info
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Slug;
