"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  FaList,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaUsers,
  FaBook,
} from "react-icons/fa";

interface ReadingList {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  books: string[];
  followers: string[];
}

interface ReadingListsProps {
  bookId?: string;
  className?: string;
}

export default function ReadingLists({
  bookId,
  className = "",
}: ReadingListsProps) {
  const { data: session, status } = useSession();
  const [lists, setLists] = useState<ReadingList[]>([]);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isEditingList, setIsEditingList] = useState<string | null>(null);
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchLists();
    }
  }, [status]);

  const fetchLists = async () => {
    try {
      const response = await fetch("/api/lists");
      if (response.ok) {
        const data = await response.json();
        setLists(data.lists);
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  const createList = async () => {
    if (!session?.user?.email || !listName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: listName.trim(),
          description: listDescription.trim(),
          isPublic,
          books: bookId ? [bookId] : [],
        }),
      });

      if (response.ok) {
        await fetchLists();
        setIsCreatingList(false);
        setListName("");
        setListDescription("");
        setIsPublic(false);
      }
    } catch (error) {
      console.error("Error creating list:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateList = async (listId: string) => {
    if (!session?.user?.email || !listName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/lists", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listId,
          action: "update",
          name: listName.trim(),
          description: listDescription.trim(),
          isPublic,
        }),
      });

      if (response.ok) {
        await fetchLists();
        setIsEditingList(null);
        setListName("");
        setListDescription("");
        setIsPublic(false);
      }
    } catch (error) {
      console.error("Error updating list:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteList = async (listId: string) => {
    if (!session?.user?.email) return;

    if (!confirm("Are you sure you want to delete this list?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/lists?listId=${listId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchLists();
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBookToList = async (listId: string) => {
    if (!session?.user?.email || !bookId) return;

    try {
      const response = await fetch("/api/lists", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listId,
          action: "add_book",
          bookId,
        }),
      });

      if (response.ok) {
        await fetchLists();
      }
    } catch (error) {
      console.error("Error adding book to list:", error);
    }
  };

  const removeBookFromList = async (listId: string) => {
    if (!session?.user?.email || !bookId) return;

    try {
      const response = await fetch("/api/lists", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listId,
          action: "remove_book",
          bookId,
        }),
      });

      if (response.ok) {
        await fetchLists();
      }
    } catch (error) {
      console.error("Error removing book from list:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const startEditing = (list: ReadingList) => {
    setIsEditingList(list.id);
    setListName(list.name);
    setListDescription(list.description);
    setIsPublic(list.isPublic);
  };

  const cancelEditing = () => {
    setIsEditingList(null);
    setListName("");
    setListDescription("");
    setIsPublic(false);
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FaList className="text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900">Reading Lists</h3>
        </div>
        <button
          onClick={() => setIsCreatingList(true)}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
        >
          <FaPlus />
          Create List
        </button>
      </div>

      {(isCreatingList || isEditingList) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 border border-gray-200 rounded-lg"
        >
          <h4 className="font-medium text-gray-900 mb-3">
            {isEditingList ? "Edit List" : "Create New List"}
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                List Name *
              </label>
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter list name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={listDescription}
                onChange={(e) => setListDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Describe your list..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Make this list public
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  isEditingList ? updateList(isEditingList) : createList()
                }
                disabled={loading || !listName.trim()}
                className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : isEditingList
                  ? "Update List"
                  : "Create List"}
              </button>
              <button
                onClick={cancelEditing}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {lists.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No reading lists yet. Create your first list!
          </p>
        ) : (
          lists.map((list, index) => (
            <motion.div
              key={list.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{list.name}</h4>
                    {list.isPublic ? (
                      <FaEye className="text-amber-500" title="Public" />
                    ) : (
                      <FaEyeSlash className="text-gray-400" title="Private" />
                    )}
                  </div>
                  {list.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {list.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaBook />
                      {list.books.length} books
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUsers />
                      {list.followers.length} followers
                    </span>
                    <span>Created {formatDate(list.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {bookId && (
                    <button
                      onClick={() =>
                        list.books.includes(bookId)
                          ? removeBookFromList(list.id)
                          : addBookToList(list.id)
                      }
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        list.books.includes(bookId)
                                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                    >
                      {list.books.includes(bookId) ? "Remove" : "Add"}
                    </button>
                  )}

                  {list.createdBy === session?.user?.email && (
                    <>
                      <button
                        onClick={() => startEditing(list)}
                        className="p-2 text-gray-600 hover:text-amber-600 transition-colors"
                        title="Edit List"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteList(list.id)}
                        disabled={loading}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete List"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {list.books.length > 0 && (
                <div className="text-xs text-gray-500">
                  Books: {list.books.length} in this list
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
