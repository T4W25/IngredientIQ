// src/pages/moderator/ModeratorDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationCircleIcon,
  EyeIcon,
  UserIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { getDraftRecipes, publishRecipe, deleteRecipe } from '../../api/api';
import avatar from "../../assets/default-avatar.png";

// Mock data (replace with your actual data fetching)
const MOCK_QUEUE = [
  {
    _id: 1,
    title: "Mediterranean Pasta",
    cuisine: "Italian",
    category: "Main Course",
    mainImage: "https://source.unsplash.com/400x300/?pasta",
    user: {
      name: "Chef John",
      avatar: "https://i.pravatar.cc/150?img=1",
      isVerified: true
    },
    createdAt: new Date()
  },
  // Add more mock items as needed
];

const ModeratorDashboard = () => {
  const [queue, setQueue] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [recipeToReject, setRecipeToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDraftRecipes();
  }, []);

  const fetchDraftRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDraftRecipes();
      setQueue(response.data);
    } catch (error) {
      console.error('Error fetching draft recipes:', error);
      setError(error.response?.data?.message || 'Failed to fetch draft recipes');
      toast.error('Failed to fetch draft recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await publishRecipe(id);
      setQueue(prev => prev.filter(item => item._id !== id));
      toast.success('Recipe approved and published successfully');
      await fetchDraftRecipes(); // Refresh the queue
    } catch (error) {
      console.error("Error approving recipe:", error);
      toast.error('Failed to approve recipe');
    }
  };

  const handleRejectClick = (recipe) => {
    setRecipeToReject(recipe);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleLogout = () => {
    window.location.href = "/auth";
  };

  const confirmReject = async () => {
    if (recipeToReject && rejectionReason.trim()) {
      try {
        await deleteRecipe(recipeToReject._id);
        setQueue(prev => prev.filter(item => item._id !== recipeToReject._id));
        setShowRejectModal(false);
        setRecipeToReject(null);
        setRejectionReason("");
        toast.success('Recipe rejected and deleted successfully');
        await fetchDraftRecipes(); // Refresh the queue
      } catch (error) {
        console.error("Error rejecting recipe:", error);
        toast.error('Failed to reject recipe');
      }
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchDraftRecipes}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-800">
                Moderator Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Review and manage submitted recipes
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/moderator/reports"
                className="flex items-center px-4 py-2 bg-red-500 text-white 
                  rounded-lg hover:bg-red-600 transition-colors shadow-md"
              >
                <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                Reports
              </Link>
              <Link
                to="/moderator/chef-verification"
                className="flex items-center px-4 py-2 bg-primary-600 text-white 
                  rounded-lg hover:bg-primary-700 transition-colors shadow-md"
              >
                <UserIcon className="w-5 h-5 mr-2" />
                Chef Verification
              </Link>
              <button onClick={handleLogout}>
                <Link
                    to="/moderator/chef-verification"
                    className="flex items-center px-4 py-2 bg-primary-600 text-white 
                        rounded-lg hover:bg-primary-700 transition-colors shadow-md"
                >
                Logout
              </Link>
            </button>
            </div>
            
          </div>

          {/* Queue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Pending Review</p>
                  <h3 className="text-2xl font-bold text-primary-600">
                    {queue.length}
                  </h3>
                </div>
                <BellIcon className="w-8 h-8 text-primary-500" />
              </div>
            </motion.div>
            {/* Add more stat cards as needed */}
          </div>

          {/* Queue Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-primary-800">
                Moderation Queue
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 
                  border-primary-500 border-t-transparent"></div>
              </div>
            ) : queue.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                No items in the moderation queue
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Recipe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Chef
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {queue.map((item) => (
                      <tr 
                      key={item._id} 
                      className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={item.mainImage || 'https://via.placeholder.com/150'} // Add fallback image
                              alt={item.title}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {item.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.cuisine} • {item.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={item.authorId?.profilePicture  || avatar} // Use authorId instead of user
                              alt={item.authorId?.username || 'Author'}
                              className="h-8 w-8 rounded-full"
                            /> 
                            <span className="ml-2 font-medium text-gray-900">
                              {item.authorId?.username} {/* Use authorId instead of user */}
                              {item.authorId?.isVerified && (
                                <CheckCircleIcon 
                                  className="inline-block h-4 w-4 ml-1 text-primary-500" 
                                />
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-3">
                            <button
                              className="text-gray-400 hover:text-primary-600 
                                transition-colors"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleApprove(item._id)}
                              className="text-gray-400 hover:text-green-600 
                                transition-colors"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRejectClick(item)}
                              className="text-gray-400 hover:text-red-600 
                                transition-colors"
                            >
                              <XCircleIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Reject Recipe
              </h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting "
                {recipeToReject?.title}". This will be sent to the chef.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 
                  focus:border-transparent transition-all duration-200 mb-4"
                placeholder="Explain why this recipe is being rejected..."
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 
                    transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReject}
                  disabled={!rejectionReason.trim()}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg
                    hover:bg-red-600 transition-colors disabled:opacity-50
                    disabled:cursor-not-allowed"
                >
                  Reject Recipe
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorDashboard;