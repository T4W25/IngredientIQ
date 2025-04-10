import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getUserProfile } from "../../api/api";
import ProfileForm from "./ProfileForm";
import ProfileView from "./ProfileView";
import { toast } from "react-toastify";
import Navbar from "../ui/navbar";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);  // Initialize user state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await getUserProfile(token); // Fetch user profile data
      setUser(response.data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      setError(error.message || "Failed to fetch profile");
      toast.error(error.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
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
            onClick={fetchUserProfile}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />  {/* Ensure this line is present */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-custom overflow-hidden">
            {isEditing ? (
              <ProfileForm
                user={user}
                setUser={setUser}
                setIsEditing={setIsEditing}
                refreshProfile={fetchUserProfile}
              />
            ) : (
              <ProfileView user={user} setIsEditing={setIsEditing} />
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProfilePage;
