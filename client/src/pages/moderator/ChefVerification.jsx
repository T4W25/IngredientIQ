// src/pages/moderator/ChefVerification.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeftIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { getVerificationRequests, approveVerification, rejectVerification } from '../../api/api';
import { toast } from 'react-toastify';

const ChefVerification = () => {
  const [requests, setRequests] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [authorToReject, setAuthorToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      
      const data = await getVerificationRequests();
      setRequests(data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch verification requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (authorId) => {
    try {
      
      await approveVerification(authorId);
      setRequests(prev => prev.filter(req => req._id !== authorId));
      toast.success('Author verified successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to verify author');
    }
  };

  const handleRejectClick = (author) => {
    setAuthorToReject(author);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (authorToReject && rejectionReason.trim()) {
      try {
        
        await rejectVerification(authorToReject._id, rejectionReason);
        setRequests(prev => prev.filter(req => req._id !== authorToReject._id));
        setShowRejectModal(false);
        setAuthorToReject(null);
        setRejectionReason("");
        toast.success('Verification request rejected');
      } catch (error) {
        toast.error(error.message || 'Failed to reject verification request');
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
                Author Verification
              </h1>
              <p className="text-gray-600 mt-1">
                Review and verify author credentials
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
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Documents
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
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {request.username}
                              </div>
                              <div className="text-sm text-gray-500">
                                {request.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${request.role === 'Chef' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {request.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {request.verificationDocuments?.map((doc, index) => (
                              <a
                                key={index}
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700 text-sm"
                              >
                                Document {index + 1}
                              </a>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleApprove(request._id)}
                              className="text-gray-400 hover:text-green-600 
                                transition-colors"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRejectClick(request)}
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
                Please provide a reason for rejecting {authorToReject?.username}'s 
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