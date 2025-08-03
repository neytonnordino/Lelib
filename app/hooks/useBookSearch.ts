import { useState } from "react";

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

interface SearchResult {
  items: Book[];
  totalItems: number;
  kind: string;
  error?: string;
}

interface UseBookSearchReturn {
  books: Book[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  searchBooks: (query: string, startIndex?: number) => Promise<void>;
  clearResults: () => void;
}

export const useBookSearch = (): UseBookSearchReturn => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const searchBooks = async (query: string, startIndex: number = 0) => {
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        startIndex: startIndex.toString(),
        maxResults: "20",
      });

      const response = await fetch(`/api/books?${params}`);
      const data: SearchResult = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch books");
      }

      if (startIndex === 0) {
        setBooks(data.items || []);
      } else {
        setBooks((prev) => [...prev, ...(data.items || [])]);
      }

      setTotalItems(data.totalItems || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setBooks([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setBooks([]);
    setError(null);
    setTotalItems(0);
  };

  return {
    books,
    loading,
    error,
    totalItems,
    searchBooks,
    clearResults,
  };
};
