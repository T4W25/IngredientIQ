  // MediaSection Component
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { 
  XMarkIcon, 
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import axios from "axios";
import API_BASE_URL from "../../api/api";

  const MediaSection = ({ formData, setFormData, errors }) => {
    const handleImageUpload = async (file) => {
      try {
        if (!file) return null;
        
        if (file.size > 5000000) { // 5MB
          toast.error('Image size should be less than 5MB');
          return null;
        }
        
        if (!checkTokenValidity()) {
          toast.error('Your session has expired. Please login again.');
          navigate('/auth');
          return;
        }
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('image', file);
    
        
        const response = await axios.post(
          `${API_BASE_URL}/upload/image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            }
          }
        );
    
        return response.data.url; // This will be the Base64 string
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        return null;
      }
    };
    
  
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-primary-800">Media</h2>
  
        {/* Main Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Recipe Image*
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 
            border-dashed rounded-lg hover:border-primary-500 transition-colors duration-200">
            <div className="space-y-1 text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium 
                  text-primary-600 hover:text-primary-700 focus-within:outline-none">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
          {errors.mainImage && (
            <p className="mt-1 text-sm text-red-500">{errors.mainImage}</p>
          )}
          {formData.mainImage && (
            <div className="mt-4 relative">
              <img
                src={formData.mainImage}
                alt="Recipe preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, mainImage: "" }))}
                className="absolute top-2 right-2 bg-white rounded-full p-1 
                  shadow-lg hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default MediaSection;