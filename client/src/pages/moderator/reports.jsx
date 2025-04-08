// src/pages/moderator/Reports.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeftIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

// Mock data (replace with your actual data)
const MOCK_REPORTS = [
  {
    _id: 1,
    contentType: "recipe",
    content: {
      title: "Spicy Pasta",
      mainImage: "https://source.unsplash.com/400x300/?pasta",
      user: { name: "Chef John" }
    },
    reason: "Inappropriate Content",
    description: "This recipe contains offensive language",
    reportedBy: {
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    createdAt: new Date()
  },
  // Add more mock data as needed
];

const ReportBadge = ({ type }) => {
  const colors = {
    "Inappropriate Content": "bg-red-100 text-red-800",
    "Spam": "bg-yellow-100 text-yellow-800",
    "Copyright": "bg-blue-100 text-blue-800",
    "Other": "bg-gray-100 text-gray-800"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[type] || colors.Other}`}>
      {type}
    </span>
  );
};

const Reports = () => {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [loading, setLoading] = useState(false);

  const handleResolve = async (id) => {
    try {
      // Add your resolve logic here
      setReports(prev => prev.filter(report => report._id !== id));
    } catch (error) {
      console.error("Error resolving report:", error);
    }
  };

  const handleDismiss = async (id) => {
    try {
      // Add your dismiss logic here
      setReports(prev => prev.filter(report => report._id !== id));
    } catch (error) {
      console.error("Error dismissing report:", error);
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
                Content Reports 
              </h1>
              <p className="text-gray-600 mt-1">
                Review and manage reported content
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
                  <p className="text-gray-600">Active Reports</p>
                  <h3 className="text-2xl font-bold text-primary-600">
                    {reports.length}
                  </h3>
                </div>
                <ExclamationCircleIcon className="w-8 h-8 text-primary-500" />
              </div>
            </motion.div>
            {/* Add more stat cards as needed */}
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-primary-800">
                Reported Content
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 
                  border-primary-500 border-t-transparent"></div>
              </div>
            ) : reports.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                No reports to review
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Content
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Reported By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium 
                        text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reports.map((report) => (
                      <tr 
                        key={report._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={report.content.mainImage}
                              alt={report.content.title}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {report.content.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                by {report.content.user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <ReportBadge type={report.reason} />
                          <p className="mt-1 text-sm text-gray-500">
                            {report.description}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={report.reportedBy.avatar}
                              alt={report.reportedBy.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <span className="ml-2 text-sm text-gray-900">
                              {report.reportedBy.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end space-x-3">
                            <button className="text-gray-400 hover:text-primary-600 
                              transition-colors">
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleResolve(report._id)}
                              className="text-gray-400 hover:text-green-600 
                                transition-colors"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDismiss(report._id)}
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
    </div>
  );
};

export default Reports;