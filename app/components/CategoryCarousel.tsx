import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "../config/CategoryData";
import CategoryTitle from "./CategoryTitle";
import Link from "next/link";

export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth;

      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="px-6 relative">
      {categories.map((category) => (
        <div key={category.categoryName} className="mb-12">
          <CategoryTitle
            className="transition"
            categoryName={category.categoryName}
          />
          <div className="overflow-hidden">
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto scroll-smooth"
            >
              <AnimatePresence mode="wait">
                {category.books.map((book) => (
                  <Link
                    key={book.name}
                    href={`/book/${
                      book.id ||
                      encodeURIComponent(
                        book.name.toLowerCase().replace(/\s+/g, "-")
                      )
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="min-w-[220px] h-auto bg-white rounded-xl shadow-md p-4 hover:-translate-y-2 duration-400 transition hover:shadow-lg cursor-pointer"
                    >
                      <img
                        src={book.image}
                        alt={book.name}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div className="mt-2">
                        <h3 className="font-semibold text-xl text-shadow-2xs">
                          {book.name}
                        </h3>
                        <p className="text-md font-medium text-orange-500">
                          {book.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {book.count} Books available
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
