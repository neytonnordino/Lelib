import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "../config/CategoryData";
import CategoryTitle from "./CategoryTitle";
import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "./FavoriteButton";

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

interface CachedData {
  data: Book[];
  timestamp: number;
}

// Fallback data for when API is rate limited
const FALLBACK_BOOKS: Book[] = [
  {
    id: "fallback1",
    volumeInfo: {
      title: "Sample Book 1",
      authors: ["Sample Author"],
      imageLinks: {
        thumbnail: "https://via.placeholder.com/128x192?text=Book+1",
      },
      averageRating: 4.5,
    },
  },
  {
    id: "fallback2",
    volumeInfo: {
      title: "Sample Book 2",
      authors: ["Sample Author"],
      imageLinks: {
        thumbnail: "https://via.placeholder.com/128x192?text=Book+2",
      },
      averageRating: 4.2,
    },
  },
  {
    id: "fallback3",
    volumeInfo: {
      title: "Sample Book 3",
      authors: ["Sample Author"],
      imageLinks: {
        thumbnail: "https://via.placeholder.com/128x192?text=Book+3",
      },
      averageRating: 4.0,
    },
  },
  {
    id: "fallback4",
    volumeInfo: {
      title: "Sample Book 4",
      authors: ["Sample Author"],
      imageLinks: {
        thumbnail: "https://via.placeholder.com/128x192?text=Book+4",
      },
      averageRating: 4.3,
    },
  },
  {
    id: "fallback5",
    volumeInfo: {
      title: "Sample Book 5",
      authors: ["Sample Author"],
      imageLinks: {
        thumbnail: "https://via.placeholder.com/128x192?text=Book+5",
      },
      averageRating: 4.1,
    },
  },
];

export default function CategoryCarousel() {
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [canScrollLeft, setCanScrollLeft] = useState<{
    [key: string]: boolean;
  }>({});
  const [canScrollRight, setCanScrollRight] = useState<{
    [key: string]: boolean;
  }>({});
  const [categoryBooks, setCategoryBooks] = useState<{
    [key: string]: Book[];
  }>({});
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [errorStates, setErrorStates] = useState<{
    [key: string]: boolean;
  }>({});

  // Cache duration: 2 hours (increased from 1 hour)
  const CACHE_DURATION = 2 * 60 * 60 * 1000;

  // Development mode - use fallback data only to prevent API calls
  const DEV_MODE = process.env.NODE_ENV === "development";

  const getCachedData = useCallback(
    (categoryName: string): Book[] | null => {
      try {
        const cached = localStorage.getItem(`category_${categoryName}`);
        if (cached) {
          const parsed: CachedData = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            return parsed.data;
          }
        }
      } catch (error) {
        console.warn("Failed to read from cache:", error);
      }
      return null;
    },
    [CACHE_DURATION]
  );

  const setCachedData = useCallback((categoryName: string, data: Book[]) => {
    try {
      const cacheData: CachedData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        `category_${categoryName}`,
        JSON.stringify(cacheData)
      );
    } catch (error) {
      console.warn("Failed to write to cache:", error);
    }
  }, []);

  // Cache clearing function (unused but available for debugging)
  // const clearCache = useCallback(() => {
  //   try {
  //     categories.forEach(category => {
  //       localStorage.removeItem(`category_${category.categoryName}`);
  //     });
  //     console.log('Category cache cleared');
  //   } catch (error) {
  //     console.warn('Failed to clear cache:', error);
  //   }
  // }, []);

  const checkScrollPosition = (categoryName: string) => {
    const scrollContainer = scrollRefs.current[categoryName];
    if (scrollContainer) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const canScrollLeftValue = scrollLeft > 0;
      const canScrollRightValue = scrollLeft < scrollWidth - clientWidth - 1;

      setCanScrollLeft((prev) => {
        if (prev[categoryName] !== canScrollLeftValue) {
          return { ...prev, [categoryName]: canScrollLeftValue };
        }
        return prev;
      });

      setCanScrollRight((prev) => {
        if (prev[categoryName] !== canScrollRightValue) {
          return { ...prev, [categoryName]: canScrollRightValue };
        }
        return prev;
      });
    }
  };

  const scroll = (categoryName: string, direction: "left" | "right") => {
    const scrollContainer = scrollRefs.current[categoryName];
    if (scrollContainer) {
      const { scrollLeft, clientWidth } = scrollContainer;
      const scrollAmount = clientWidth * 0.8; // Scroll 80% of container width

      scrollContainer.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });

      // Check scroll position after animation
      setTimeout(() => checkScrollPosition(categoryName), 500);
    }
  };

  const handleScroll = (categoryName: string) => {
    // Use requestAnimationFrame to throttle scroll events
    requestAnimationFrame(() => {
      checkScrollPosition(categoryName);
    });
  };

  const handleKeyDown = (categoryName: string, event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scroll(categoryName, "left");
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scroll(categoryName, "right");
    }
  };

  const getCategorySearchQuery = (categoryName: string): string => {
    const categoryQueries: { [key: string]: string } = {
      Fiction: "fiction bestsellers",
      "Self-Help": "self help personal development",
      Romance: "romance novels",
      "Personal Development": "personal development business",
    };

    return categoryQueries[categoryName] || categoryName.toLowerCase();
  };

  const loadCategoryBooks = useCallback(
    async (categoryName: string) => {
      // Check if already loading or in error state
      if (loadingStates[categoryName] || errorStates[categoryName]) return;

      // Check cache first
      const cachedData = getCachedData(categoryName);
      if (cachedData) {
        setCategoryBooks((prev) => ({
          ...prev,
          [categoryName]: cachedData,
        }));
        return;
      }

      // In development mode, use fallback data to prevent API calls
      if (DEV_MODE) {
        console.log(
          `Development mode: Using fallback data for ${categoryName}`
        );
        setCategoryBooks((prev) => ({
          ...prev,
          [categoryName]: FALLBACK_BOOKS,
        }));
        return;
      }

      setLoadingStates((prev) => ({ ...prev, [categoryName]: true }));

      try {
        // Create a search query based on category
        const searchQuery = getCategorySearchQuery(categoryName);
        const response = await fetch(
          `/api/books?q=${encodeURIComponent(searchQuery)}&maxResults=10`
        );

        if (response.status === 429) {
          console.warn(`Rate limited for ${categoryName}, using fallback data`);
          setCategoryBooks((prev) => ({
            ...prev,
            [categoryName]: FALLBACK_BOOKS,
          }));
          setErrorStates((prev) => ({ ...prev, [categoryName]: true }));
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
          setCategoryBooks((prev) => ({
            ...prev,
            [categoryName]: data.items,
          }));
          // Cache the successful response
          setCachedData(categoryName, data.items);
        } else {
          // Use fallback data if no results
          setCategoryBooks((prev) => ({
            ...prev,
            [categoryName]: FALLBACK_BOOKS,
          }));
        }
      } catch (error) {
        console.error(`Error loading books for ${categoryName}:`, error);
        // Use fallback data on error
        setCategoryBooks((prev) => ({
          ...prev,
          [categoryName]: FALLBACK_BOOKS,
        }));
        setErrorStates((prev) => ({ ...prev, [categoryName]: true }));
      } finally {
        setLoadingStates((prev) => ({ ...prev, [categoryName]: false }));
      }
    },
    [loadingStates, errorStates, getCachedData, setCachedData, DEV_MODE]
  );

  // Initialize scroll positions and load category books after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      categories.forEach((category) => {
        checkScrollPosition(category.categoryName);
      });

      // Load books with much longer staggered delays to avoid rate limiting
      categories.forEach((category, index) => {
        setTimeout(() => {
          loadCategoryBooks(category.categoryName);
        }, index * 3000); // 3 second delay between each request (increased from 1 second)
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [loadCategoryBooks]);

  return (
    <div className="px-6 relative">
      {categories.map((category) => (
        <div key={category.categoryName} className="">
          <CategoryTitle categoryName={category.categoryName} />
          <div className="relative group my-6">
            {/* Left Navigation Button */}
            <button
              onClick={() => scroll(category.categoryName, "left")}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200 transition-all duration-300 hover:bg-white hover:shadow-xl ${
                canScrollLeft[category.categoryName]
                  ? "opacity-100 translate-x-2"
                  : "opacity-0 -translate-x-4 pointer-events-none"
              } group-hover:opacity-100 group-hover:translate-x-2`}
              aria-label={`Scroll ${category.categoryName} left`}
            >
              <svg
                className="w-5 h-5 text-gray-700"
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
            </button>

            {/* Right Navigation Button */}
            <button
              onClick={() => scroll(category.categoryName, "right")}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200 transition-all duration-300 hover:bg-white hover:shadow-xl ${
                canScrollRight[category.categoryName]
                  ? "opacity-100 -translate-x-2"
                  : "opacity-0 translate-x-4 pointer-events-none"
              } group-hover:opacity-100 group-hover:-translate-x-2`}
              aria-label={`Scroll ${category.categoryName} right`}
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="overflow-hidden">
              <div
                ref={(el) => {
                  scrollRefs.current[category.categoryName] = el;
                }}
                onScroll={() => handleScroll(category.categoryName)}
                onKeyDown={(e) => handleKeyDown(category.categoryName, e)}
                tabIndex={0}
                role="region"
                aria-label={`${category.categoryName} books carousel`}
                className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide focus:outline-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <AnimatePresence>
                  {categoryBooks[category.categoryName]
                    ? categoryBooks[category.categoryName].map(
                        (book, index) => (
                          <Link
                            key={book.id}
                            href={`/book/${book.id}`}
                            className="flex-shrink-0"
                          >
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.1 }}
                              className="w-[220px] h-full bg-white rounded-xl shadow-md p-4 hover:-translate-y-2 duration-400 transition-all hover:shadow-lg cursor-pointer border border-gray-100 flex-shrink-0"
                            >
                              <div className="relative overflow-hidden rounded-lg">
                                {book.volumeInfo.imageLinks?.thumbnail ? (
                                  <Image
                                    src={book.volumeInfo.imageLinks.thumbnail.replace(
                                      "http://",
                                      "https://"
                                    )}
                                    alt={book.volumeInfo.title}
                                    width={220}
                                    height={160}
                                    className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">
                                      No image
                                    </span>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute top-2 right-2 z-10">
                                  <div onClick={(e) => e.preventDefault()}>
                                    <FavoriteButton
                                      bookId={book.id}
                                      size="sm"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3">
                                <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 text-wrap">
                                  {book.volumeInfo.title}
                                </h3>
                                {book.volumeInfo.authors && (
                                  <p className="text-sm font-medium text-orange-500 mt-1 line-clamp-2">
                                    by {book.volumeInfo.authors.join(", ")}
                                  </p>
                                )}
                                {book.volumeInfo.averageRating && (
                                  <div className="flex items-center mt-2">
                                    <span className="text-yellow-500 text-sm">
                                      ★
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">
                                      {book.volumeInfo.averageRating.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </Link>
                        )
                      )
                    : // Loading state
                      Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className="w-[220px] h-full bg-white rounded-xl shadow-md p-4 border border-gray-100 flex-shrink-0 animate-pulse"
                        >
                          <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      ))}
                </AnimatePresence>
              </div>
              <hr className="text-neutral-500/30 mt-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
