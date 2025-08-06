"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FaBookOpen, FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";

interface ReadingProgress {
  bookId: string;
  currentPage: number;
  totalPages: number;
  startDate: string;
  lastReadDate: string;
  isCompleted: boolean;
  readingTime?: number;
  notes?: string;
}

interface ReadingProgressProps {
  bookId: string;
  totalPages?: number;
  className?: string;
}

export default function ReadingProgress({
  bookId,
  totalPages,
  className = "",
}: ReadingProgressProps) {
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && bookId) {
      fetchProgress();
    }
  }, [status, bookId]);

  const fetchProgress = async () => {
    try {
      const response = await fetch("/api/progress");
      if (response.ok) {
        const data = await response.json();
        const bookProgress = data.progress.find(
          (p: ReadingProgress) => p.bookId === bookId
        );
        if (bookProgress) {
          setProgress(bookProgress);
          setCurrentPage(bookProgress.currentPage);
          setNotes(bookProgress.notes || "");
        }
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const updateProgress = async () => {
    if (!session?.user?.email || !totalPages) return;

    setLoading(true);
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          currentPage,
          totalPages,
          notes: notes.trim() || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProgress = async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/progress?bookId=${bookId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProgress(null);
        setCurrentPage(0);
        setNotes("");
      }
    } catch (error) {
      console.error("Error deleting progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const startReading = () => {
    if (!totalPages) return;
    setCurrentPage(1);
    setIsEditing(true);
  };

  const progressPercentage =
    progress && totalPages
      ? Math.min((progress.currentPage / totalPages) * 100, 100)
      : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FaBookOpen className="text-amber-500" />
          Reading Progress
        </h3>
        {progress && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-600 hover:text-amber-600 transition-colors"
              title="Edit Progress"
            >
              <FaEdit />
            </button>
            <button
              onClick={deleteProgress}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Delete Progress"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      {!progress && !isEditing ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Start tracking your reading progress
          </p>
          <button
            onClick={startReading}
            disabled={!totalPages}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Reading
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {progress && !isEditing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {progress.currentPage} / {progress.totalPages} pages
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-amber-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{Math.round(progressPercentage)}% complete</span>
                {progress.isCompleted && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <FaCheckCircle />
                    Completed
                  </span>
                )}
              </div>

              {progress.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{progress.notes}</p>
                </div>
              )}

              <div className="text-xs text-gray-500 space-y-1">
                <p>Started: {formatDate(progress.startDate)}</p>
                <p>Last read: {formatDate(progress.lastReadDate)}</p>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Page
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalPages || 9999}
                  value={currentPage}
                  onChange={(e) =>
                    setCurrentPage(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Add your thoughts, quotes, or notes..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={updateProgress}
                  disabled={loading || !totalPages}
                  className="flex-1 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Progress"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    if (progress) {
                      setCurrentPage(progress.currentPage);
                      setNotes(progress.notes || "");
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
