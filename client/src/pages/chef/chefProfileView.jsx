// ChefProfileView.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPen, FaCalendar, FaCheckCircle, FaClock } from 'react-icons/fa';

const ChefProfileView = ({ user, setIsEditing }) => {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-32 h-32 mx-auto mb-6"
        >
          <img
            src={user.profilePicture || '/default-avatar.png'}
            alt={user.username}
            className="rounded-full w-full h-full object-cover border-4 border-primary-100"
          />
          <div className="absolute -bottom-2 right-0">
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

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
          <div className="mt-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              user.isVerified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user.isVerified ? 'Verified Chef' : 'Verification Pending'}
            </span>
          </div>
          <p className="text-gray-500 mt-4">{user.bio || 'No bio added yet'}</p>
        </div>

        {/* Contact and Join Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center p-4 bg-primary-50 rounded-lg">
            <FaEnvelope className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-primary-50 rounded-lg">
            <FaCalendar className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="text-gray-800 font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Verification Documents */}
        {user.verificationDocuments && user.verificationDocuments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Verification Documents</h2>
            <div className="grid grid-cols-1 gap-2">
              {user.verificationDocuments.map((doc, index) => (
                <a
                  key={index}
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaUser className="w-4 h-4 text-primary-600 mr-2" />
                  <span className="text-primary-600">Document {index + 1}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Additional Chef Information */}
        {user.specialties && user.specialties.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {user.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefProfileView;