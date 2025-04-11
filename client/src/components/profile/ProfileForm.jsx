import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaCamera, FaCheck, FaTimes, FaLock } from 'react-icons/fa';
import { updateUserProfile, uploadUserProfileImage } from '../../api/api';
import { toast } from 'react-toastify';
import Avatar from '../../assets/Avatar';
import { useNavigate } from 'react-router-dom';

const ProfileForm = ({ user, setUser, setIsEditing, refreshProfile }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    bio: user.bio || '',
    profilePicture: user.profilePicture || '',  // Ensure this is set correctly
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await uploadUserProfileImage(token, file); // Upload image to backend
      setFormData((prev) => ({ ...prev, profilePicture: response.data.url })); // Set the image URL returned by backend
      toast.success('Profile picture uploaded successfully');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  const validateForm = () => {
    if (showPasswordFields) {
      if (!formData.currentPassword) {
        toast.error('Current password is required to change password');
        return false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match');
        return false;
      }
      if (formData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        profilePicture: formData.profilePicture // Ensure profile picture is included in the update payload
      };

      if (showPasswordFields) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      await updateUserProfile(token, payload);
      await refreshProfile();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
      navigate('/profile');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8">
      {/* Profile Picture */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <Avatar
          src={formData.profilePicture}  // Use the updated image URL here
          alt={formData.username}
          className="w-full h-full border-4 border-primary-100"
        />
        <label className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 cursor-pointer transition-colors duration-200">
          <FaCamera className="w-4 h-4" />
          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
        </label>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Password Fields (Optional) */}
        <div>
          <button
            type="button"
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
          </button>
        </div>

        {/* Password Fields */}
        {showPasswordFields && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <><FaCheck className="w-4 h-4" /><span>Save Changes</span></>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setIsEditing(false)}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300"
          >
            <FaTimes className="w-4 h-4" />
            <span>Cancel</span>
          </motion.button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;