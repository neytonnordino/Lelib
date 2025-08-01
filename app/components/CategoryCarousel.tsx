import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "../config/CategoryData";
import CategoryTitle from "./CategoryTitle";
import Link from "next/link";

export default function CategoryCarousel() {
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [canScrollLeft, setCanScrollLeft] = useState<{
    [key: string]: boolean;
  }>({});
  const [canScrollRight, setCanScrollRight] = useState<{
    [key: string]: boolean;
  }>({});

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

  // Initialize scroll positions after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      categories.forEach((category) => {
        checkScrollPosition(category.categoryName);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="px-6 relative">
      {categories.map((category) => (
        <div key={category.categoryName} className="">
          <CategoryTitle
            className="transition my-12"
            categoryName={category.categoryName}
          />
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
                <AnimatePresence mode="wait">
                  {category.books.map((book, index) => (
                    <Link
                      key={book.name}
                      href={`/book/${
                        book.id ||
                        encodeURIComponent(
                          book.name.toLowerCase().replace(/\s+/g, "-")
                        )
                      }`}
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
                          <img
                            src={book.image}
                            alt={book.name}
                            className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="mt-3">
                          <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 text-wrap">
                            {book.name}
                          </h3>
                          <p className="text-sm font-medium text-orange-500 mt-1 line-clamp-2">
                            {book.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-2 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {book.count} Books available
                          </p>
                        </div>
                      </motion.div>
                    </Link>
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
