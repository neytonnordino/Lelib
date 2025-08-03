import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface UseFavoritesReturn {
  favorites: string[];
  isLoading: boolean;
  error: string | null;
  addToFavorites: (bookId: string) => Promise<void>;
  removeFromFavorites: (bookId: string) => Promise<void>;
  isFavorite: (bookId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

export function useFavorites(): UseFavoritesReturn {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    if (status !== "authenticated") return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/favorites");
      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }
      
      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch favorites");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFavorite = async (bookId: string, action: "add" | "remove") => {
    if (status !== "authenticated") {
      setError("Please sign in to manage favorites");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId, action }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update favorites");
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async (bookId: string) => {
    await updateFavorite(bookId, "add");
  };

  const removeFromFavorites = async (bookId: string) => {
    await updateFavorite(bookId, "remove");
  };

  const isFavorite = (bookId: string) => {
    return favorites.includes(bookId);
  };

  const refreshFavorites = async () => {
    await fetchFavorites();
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchFavorites();
    } else if (status === "unauthenticated") {
      setFavorites([]);
    }
  }, [status]);

  return {
    favorites,
    isLoading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refreshFavorites,
  };
} 