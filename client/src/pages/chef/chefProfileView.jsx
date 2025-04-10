// pages/chef/ChefProfileView.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaPen, FaCheckCircle, FaClock, FaEnvelope, FaCalendar } from 'react-icons/fa';

const ChefProfileView = ({ user, setIsEditing }) => {
  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <div className="relative text-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-32 h-32 mx-auto mb-4"
        >
          <img
            src={user.profilePicture || '/default-avatar.png'}
            alt={user.username}
            className="w-full h-full rounded-full border-4 border-primary-100 object-cover"
          />
          <div className="absolute -bottom-2 right-2">
            {user.isVerified ? (
              <FaCheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <FaClock className="w-6 h-6 text-yellow-500" />
            )}
          </div>
        </motion.div>

        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600"
        >
          <FaPen className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
        <p className="text-sm mt-2 text-gray-600">
          Role: <span className="font-semibold capitalize">{user.role}</span>
        </p>
        <p className={`mt-1 px-3 py-1 inline-block rounded-full text-sm ${
          user.isVerified
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {user.isVerified ? 'Verified Chef' : 'Pending Verification'}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center bg-primary-50 rounded-md px-4 py-2">
          <FaEnvelope className="text-primary-600 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center bg-primary-50 rounded-md px-4 py-2">
          <FaCalendar className="text-primary-600 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Joined</p>
            <p className="font-medium text-gray-800">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Bio</p>
          <p className="text-gray-700">
            {user.bio ? user.bio : 'No bio added yet.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChefProfileView;
