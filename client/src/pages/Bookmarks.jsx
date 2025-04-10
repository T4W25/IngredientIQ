import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBookmarks } from "../api/api";
import { motion } from "framer-motion";
import { FaClock, FaUtensils, FaUserFriends, FaTrash, FaBookmark } from "react-icons/fa";
import { removeBookmark } from "../api/api";
import { toast } from "react-toastify";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookmarks when the component mounts
  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please log in to view your bookmarks");
        setLoading(false);
        return;
      }

      const response = await getBookmarks(token);
      setBookmarks(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load bookmarks");
      toast.error(err.response?.data?.error || "Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please log in to remove bookmarks");
        return;
      }

      await removeBookmark(token, bookmarkId);
      
      // Update the UI by filtering out the removed bookmark
      setBookmarks(bookmarks.filter(bookmark => bookmark.recipe._id !== recipeId));
      toast.success("Recipe removed from bookmarks");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to remove bookmark");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center text-red-600 mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={fetchBookmarks}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8 flex items-center"
        >
          <FaBookmark className="text-primary-600 mr-3" />
          Your Bookmarked Recipes
        </motion.h1>

        {bookmarks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-custom p-8 text-center"
          >
            <div className="text-6xl mb-4">📌</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Bookmarks Yet</h2>
            <p className="text-gray-600 mb-6">You haven't bookmarked any recipes yet. Explore recipes and save your favorites!</p>
            <Link
              to="/search"
              className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Discover Recipes
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark, index) => {
              const recipe = bookmark.recipe;
              
              return (
                <motion.div
                  key={bookmark._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-custom overflow-hidden"
                >
                  <Link to={`/recipe/${recipe._id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={recipe.mainImage}
                        alt={recipe.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <Link to={`/recipe/${recipe._id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                        {recipe.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaClock className="mr-1" />
                        <span>{recipe.totalTime} mins</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaUtensils className="mr-1" />
                        <span className="capitalize">{recipe.difficulty}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaUserFriends className="mr-1" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveBookmark(recipe._id)}
                      className="w-full py-2 border border-red-400 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                      <FaTrash className="mr-2" />
                      Remove Bookmark
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
