// src/pages/moderator/ChefVerification.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeftIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';


// Mock data (replace with your actual data)
const MOCK_REQUESTS = [
  {
    _id: 1,
    user: {
      _id: 'u1',
      name: "John Smith",
      email: "john@example.com",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    credentials: {
      title: "Professional Chef",
      description: "10 years experience in Italian cuisine..."
    },
    recipeCount: 15,
    createdAt: new Date()
  },
  // Add more mock data as needed
];

const ChefVerification = () => {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [chefToReject, setChefToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (id) => {
    try {
      // Add your verification logic here
      setRequests(prev => prev.filter(req => req.user._id !== id));
    } catch (error) {
      console.error("Error verifying chef:", error);
    }
  };

  const handleRejectClick = (chef) => {
    setChefToReject(chef);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (chefToReject && rejectionReason.trim()) {
      try {
        // Add your rejection logic here
        setRequests(prev => prev.filter(req => req.user._id !== chefToReject._id));
        setShowRejectModal(false);
        setChefToReject(null);
        setRejectionReason("");
      } catch (error) {
        console.error("Error rejecting verification:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link
              to="/moderator/dashboard"
              className="p-2 text-gray-600 hover:text-primary-600 
                transition-colors rounded-lg hover:bg-primary-50"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary-800">
                Chef Verification
              </h1>
              <p className="text-gray-600 mt-1">
                Review and verify chef credentials
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Pending Requests</p>
                  <h3 className="text-2xl font-bold text-primary-600">
                    {requests.length}
                  </h3>
                </div>
                <UserIcon className="w-8 h-8 text-primary-500" />
              </div>
            </motion.div>
            {/* Add more stat cards as needed */}
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-primary-800">
                Verification Requests
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 
                  border-primary-500 border-t-transparent"></div>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                No pending verification requests
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Chef
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Credentials
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Recipes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Requested
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requests.map((request) => (
                      <tr 
                        key={request._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={request.user.avatar}
                              alt={request.user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {request.user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {request.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {request.credentials.title}
                            </div>
                            <div className="text-gray-500">
                              {request.credentials.description.substring(0, 50)}...
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {request.recipeCount} recipes
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end space-x-3">
                            <button className="text-gray-400 hover:text-primary-600 
                              transition-colors">
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleVerify(request.user._id)}
                              className="text-gray-400 hover:text-green-600 
                                transition-colors"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRejectClick(request.user)}
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
                Reject Verification Request
              </h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting {chefToReject?.name}'s 
                verification request.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 
                  focus:border-transparent transition-all duration-200 mb-4"
                placeholder="Explain why this verification request is being rejected..."
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
                  Reject Request
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefVerification;