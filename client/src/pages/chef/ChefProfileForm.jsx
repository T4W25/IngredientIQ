import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaCamera, 
  FaCheck, 
  FaTimes, 
  FaLock, 
  FaFileUpload,
  FaTrash 
} from 'react-icons/fa';
import { updateAuthorProfile, uploadAuthorProfileImage, uploadAuthorDocuments } from '../../api/api';
import { toast } from 'react-toastify';
import Avatar from '../../assets/Avatar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChefProfileForm = ({ user, setUser, setIsEditing, refreshProfile }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
    verificationDocuments: user?.verificationDocuments || [],
    specialties: user?.specialties || [],
    experience: user?.experience || [],
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [originalProfileData, setOriginalProfileData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const initialData = {
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || '',
        verificationDocuments: user.verificationDocuments || [],
        specialties: user.specialties || [],
        experience: user.experience || []
      };
      
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
      setOriginalProfileData(initialData);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (file.size > 5000000) {
      toast.error('Image size should be less than 5MB');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await uploadAuthorProfileImage(file, token); // Pass file directly
  
      if (response.data && response.data.url) {
        setFormData(prev => ({
          ...prev,
          profilePicture: response.data.url
        }));
        toast.success('Profile picture updated successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    }
  };

  const handleDocumentUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
  
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      for (const file of files) {
        if (file.size > 5000000) {
          toast.error(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }
  
        const response = await uploadAuthorDocuments(file, token); // Pass file directly
  
        if (response.data && response.data.documents) {
          setFormData(prev => ({
            ...prev,
            verificationDocuments: [...prev.verificationDocuments, ...response.data.documents]
          }));
        }
      }
      
      toast.success('Documents uploaded successfully');
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error(error.response?.data?.message || 'Failed to upload documents');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDocument = async (docUrl, index) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/auth/chef/remove-document`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { documentUrl: docUrl }
        }
      );

      setFormData(prev => ({
        ...prev,
        verificationDocuments: prev.verificationDocuments.filter((_, i) => i !== index)
      }));
      toast.success('Document removed successfully');
    } catch (error) {
      toast.error('Failed to remove document');
    }
  };

  const validateForm = () => {
    if (!formData.username || !formData.email) {
      toast.error('Username and email are required');
      return false;
    }

    if (showPasswordFields) {
      if (!formData.currentPassword) {
        toast.error('Current password is required to change password');
        return false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match');
        return false;
      }
      if (formData.newPassword && formData.newPassword.length < 6) {
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
      const updateData = {};

      // Compare and add only changed fields
      Object.keys(formData).forEach(key => {
        if (key === 'confirmPassword') return; // Skip confirmPassword
        
        // Handle arrays
        if (Array.isArray(formData[key])) {
          if (JSON.stringify(formData[key]) !== JSON.stringify(originalProfileData[key])) {
            updateData[key] = formData[key];
          }
        } 
        // Handle regular fields
        else if (formData[key] !== originalProfileData[key]) {
          updateData[key] = formData[key];
        }
      });

      // Add password fields if they exist
      if (showPasswordFields && formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      if (Object.keys(updateData).length > 0) {
        await updateAuthorProfile(token, updateData);
        await refreshProfile();
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.info('No changes to update');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-2xl mx-auto">
      {/* Profile Picture Section */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <Avatar
          src={formData.profilePicture}
          alt={formData.username}
          className="w-full h-full rounded-full border-4 border-primary-100"
        />
        <label className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 cursor-pointer">
          <FaCamera className="w-4 h-4" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
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

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
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
        </div>

        {/* Bio Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Tell us about your culinary journey..."
          />
        </div>

        {/* Verification Documents Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Verification Documents
          </label>
          <div className="space-y-2">
            {formData.verificationDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <a 
                  href={doc} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Document {index + 1}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(doc, index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <FaFileUpload className="mr-2" />
              Upload Documents
              <input
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleDocumentUpload}
              />
            </label>
          </div>
        </div>

        {/* Password Change Section */}
        <div>
          <button
            type="button"
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
          </button>
        </div>

        {showPasswordFields && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit and Cancel Buttons */}
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
            ) : (
              <>
                <FaCheck className="inline w-4 h-4 mr-2" />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setIsEditing(false)}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300"
          >
            <FaTimes className="inline w-4 h-4 mr-2" />
            <span>Cancel</span>
          </motion.button>
        </div>
      </div>
    </form>
  );
};

export default ChefProfileForm;