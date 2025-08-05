"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FaStar, FaThumbsUp, FaUser, FaEdit, FaTrash } from "react-icons/fa";

interface BookReview {
  bookId: string;
  userId: string;
  userEmail: string;
  userName: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
  helpfulVotes: number;
  votedBy: string[];
}

interface BookReviewsProps {
  bookId: string;
  className?: string;
}

export default function BookReviews({
  bookId,
  className = "",
}: BookReviewsProps) {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState<BookReview | null>(null);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookId) {
      fetchReviews();
    }
  }, [bookId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?bookId=${bookId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);

        // Find user's review if authenticated
        if (session?.user?.email) {
          const userReview = data.reviews.find(
            (r: BookReview) => r.userEmail === session.user.email
          );
          if (userReview) {
            setUserReview(userReview);
            setRating(userReview.rating);
            setReviewText(userReview.review);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const submitReview = async () => {
    if (!session?.user?.email || !rating || !reviewText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          rating,
          review: reviewText.trim(),
        }),
      });

      if (response.ok) {
        await fetchReviews();
        setIsWritingReview(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?bookId=${bookId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUserReview(null);
        setRating(0);
        setReviewText("");
        await fetchReviews();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setLoading(false);
    }
  };

  const voteReview = async (reviewId: string, isHelpful: boolean) => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          reviewId,
          isHelpful,
        }),
      });

      if (response.ok) {
        await fetchReviews();
      }
    } catch (error) {
      console.error("Error voting on review:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onStarClick?: (star: number) => void
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onStarClick?.(star)}
            disabled={!interactive}
            className={`${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            } transition-transform`}
          >
            <FaStar
              className={`w-4 h-4 ${
                star <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              {renderStars(averageRating)}
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>
        {status === "authenticated" && (
          <button
            onClick={() => setIsWritingReview(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Write Review
          </button>
        )}
      </div>

      {isWritingReview && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 border border-gray-200 rounded-lg"
        >
          <h4 className="font-medium text-gray-900 mb-3">
            {userReview ? "Edit Your Review" : "Write a Review"}
          </h4>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            {renderStars(rating, true, setRating)}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your thoughts about this book..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={submitReview}
              disabled={loading || !rating || !reviewText.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Submit Review"}
            </button>
            <button
              onClick={() => {
                setIsWritingReview(false);
                if (userReview) {
                  setRating(userReview.rating);
                  setReviewText(userReview.review);
                } else {
                  setRating(0);
                  setReviewText("");
                }
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {userReview && (
              <button
                onClick={deleteReview}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review this book!
          </p>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review.userId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.userName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              <p className="text-gray-700 mb-3">{review.review}</p>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => voteReview(review.userId, true)}
                  disabled={!session?.user?.email}
                  className={`flex items-center gap-1 text-sm ${
                    review.votedBy.includes(session?.user?.email || "")
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-blue-600"
                  } transition-colors disabled:opacity-50`}
                >
                  <FaThumbsUp />
                  {review.helpfulVotes} helpful
                </button>

                {review.userEmail === session?.user?.email && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setRating(review.rating);
                        setReviewText(review.review);
                        setIsWritingReview(true);
                      }}
                      className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <FaEdit />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
