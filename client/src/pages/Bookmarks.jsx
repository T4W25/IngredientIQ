// src/pages/Bookmarks.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaClock, FaUtensils, FaUserFriends, FaHeart } from 'react-icons/fa';
import Navbar from '../Components/ui/navbar';
import API_BASE_URL from '../api/api';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // src/pages/Bookmarks.jsx

const fetchBookmarks = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to view bookmarks');
      return;
    }

    const response = await axios.get(`${API_BASE_URL}/bookmarks`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Make sure we have valid data
    if (response.data && Array.isArray(response.data)) {
      // Filter out any invalid bookmarks
      const validBookmarks = response.data.filter(
        bookmark => bookmark && bookmark.recipeId
      );
      setBookmarks(validBookmarks);
    } else {
      setBookmarks([]);
    }
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    const errorMessage = error.response?.data?.error || 'Failed to load bookmarks';
    toast.error(errorMessage);
    setBookmarks([]);
  } finally {
    setLoading(false);
  }
};



  const handleDelete = async (bookmarkId) => {
    try {
      setDeletingId(bookmarkId);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/bookmarks/${bookmarkId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookmarks(bookmarks.filter(bookmark => bookmark._id !== bookmarkId));
      toast.success('Bookmark removed successfully');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Failed to remove bookmark');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-8"
          >
            My Bookmarked Recipes
          </motion.h1>

          {bookmarks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FaHeart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
              <p className="text-gray-500">Start exploring recipes and save your favorites!</p>
              <Link
                to="/recipes"
                className="mt-4 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Explore Recipes
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {bookmarks.map((bookmark) => (
                  <motion.div
                    key={bookmark._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-xl shadow-custom overflow-hidden"
                  >
                    <Link to={`/recipe/${bookmark.recipeId._id}`}>
                      <div className="relative h-48">
                        <img
                          src={bookmark.recipeId.mainImage}
                          alt={bookmark.recipeId.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/default-recipe-image.jpg'; // Add a default image
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link to={`/recipe/${bookmark.recipeId._id}`}>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                          {bookmark.recipeId.title}
                        </h2>
                      </Link>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{bookmark.recipeId.totalTime} mins</span>
                        </div>
                        <div className="flex items-center">
                          <FaUtensils className="mr-1" />
                          <span>{bookmark.recipeId.difficulty}</span>
                        </div>
                        <div className="flex items-center">
                          <FaUserFriends className="mr-1" />
                          <span>{bookmark.recipeId.servings}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(bookmark._id)}
                        disabled={deletingId === bookmark._id}
                        className={`w-full px-4 py-2 rounded-lg text-white flex items-center justify-center space-x-2
                          ${deletingId === bookmark._id 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-red-500 hover:bg-red-600'}`}
                      >
                        {deletingId === bookmark._id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <FaTrash />
                            <span>Remove Bookmark</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Bookmarks;