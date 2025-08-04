"use client";

import { IoMdSearch } from "react-icons/io";
import { useState, useRef, useEffect } from "react";
import { useBookSearch } from "../hooks/useBookSearch";
import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "./FavoriteButton";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isMobile?: boolean;
  onSearch?: (query: string) => void;
}

const SearchBar = ({
  onChange,
  placeholder = "Search books...",
  isMobile = false,
  onSearch,
}: SearchBarProps) => {
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { books, loading, error, searchBooks, clearResults } = useBookSearch();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchBooks(searchQuery);
      setShowResults(true);
      if (onSearch) {
        onSearch(searchQuery);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchBooks(searchQuery);
        setShowResults(true);
      } else {
        clearResults();
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div ref={searchRef} className="relative">
      <form
        onSubmit={handleSearch}
        className={`flex items-center bg-neutral-200 rounded-3xl text-neutral-600 py-2 px-4 cursor-pointer ${
          isMobile ? "w-70 h-10" : "lg:w-80"
        }`}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          className="outline-0 px-2 w-full bg-transparent"
          onFocus={() => setShowResults(true)}
        />
        <div className="flex items-center gap-1">
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                onChange("");
                clearResults();
                setShowResults(false);
              }}
              className="cursor-pointer hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="20"
                viewBox="0 0 50 50"
              >
                <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
              </svg>
            </button>
          )}
          <button type="submit" className="cursor-pointer hover:text-gray-800">
            <IoMdSearch className="text-xl" />
          </button>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (books.length > 0 || loading || error) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {loading && (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          )}

          {error && <div className="p-4 text-center text-red-500">{error}</div>}

          {books.length > 0 && (
            <div className="py-2">
              {books.slice(0, 5).map((book, index) => (
                <div
                  key={index}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <Link
                    href={`/book/${book.id}`}
                    className="flex items-center gap-3 flex-1"
                    onClick={() => setShowResults(false)}
                  >
                    {book.volumeInfo.imageLinks?.thumbnail && (
                      <Image
                        src={book.volumeInfo.imageLinks.thumbnail}
                        alt={book.volumeInfo.title}
                        width={48}
                        height={64}
                        className="w-12 h-16 object-cover rounded"
                        unoptimized
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {book.volumeInfo.title}
                      </h4>
                      {book.volumeInfo.authors && (
                        <p className="text-sm text-gray-500 truncate">
                          {book.volumeInfo.authors.join(", ")}
                        </p>
                      )}
                    </div>
                  </Link>
                  <div onClick={(e) => e.preventDefault()}>
                    <FavoriteButton bookId={book.id} size="sm" />
                  </div>
                </div>
              ))}
              {books.length > 5 && (
                <div className="px-4 py-2 text-center text-sm text-blue-600 hover:bg-gray-100">
                  <Link href={`/search?q=${encodeURIComponent(searchQuery)}`}>
                    View all results
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
