"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useFavorites } from "../hooks/useFavorites";
import { motion } from "framer-motion";

interface FavoriteButtonProps {
  bookId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function FavoriteButton({ 
  bookId, 
  className = "", 
  size = "md" 
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const { isFavorite, addToFavorites, removeFromFavorites, isLoading } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isFavorite(bookId);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-10 h-10"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const handleClick = async () => {
    if (status !== "authenticated") {
      // You could show a toast or redirect to sign in
      return;
    }

    if (isFavorited) {
      await removeFromFavorites(bookId);
    } else {
      await addToFavorites(bookId);
    }
  };

  // Show sign-in prompt for unauthenticated users
  if (status === "unauthenticated") {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${sizeClasses[size]} ${className} bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200`}
        onClick={() => {
          // You could show a modal or redirect to sign in
          alert("Please sign in to save favorites");
        }}
        title="Sign in to save favorites"
      >
        <svg 
          className={`${iconSizes[size]} text-gray-400`} 
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
      </motion.button>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-gray-100 rounded-full flex items-center justify-center`}>
        <div className={`${iconSizes[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`${sizeClasses[size]} ${className} ${
        isFavorited 
          ? "bg-red-100 hover:bg-red-200" 
          : "bg-gray-100 hover:bg-gray-200"
      } rounded-full flex items-center justify-center transition-colors duration-200`}
      onClick={handleClick}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <motion.svg 
        className={`${iconSizes[size]} ${
          isFavorited ? "text-red-500" : "text-gray-400"
        }`}
        fill={isFavorited ? "currentColor" : "none"}
        stroke="currentColor" 
        viewBox="0 0 24 24"
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </motion.svg>
    </motion.button>
  );
} 