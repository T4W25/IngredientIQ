import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPen, FaCalendar } from "react-icons/fa";
import ProfilePicture from "./ProfilePicture"; // Import ProfilePicture component

const ProfileView = ({ user, setIsEditing }) => {
  return (
    <div className="p-8">
      <div className="relative">
      <motion.div whileHover={{ scale: 1.05 }} className="relative w-32 h-32 mx-auto mb-6">
  <img
    src={user.profilePicture || '/default-avatar.png'}
    alt={user.username}
    className="rounded-full w-full h-full object-cover border-4 border-primary-100"
  />
</motion.div>


        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors duration-200"
        >
          <FaPen className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
          <p className="text-gray-500 mt-2">{user.bio || "No bio added yet"}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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
      </div>
    </div>
  );
};

export default ProfileView;
