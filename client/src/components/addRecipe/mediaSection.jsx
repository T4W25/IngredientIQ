  // MediaSection Component
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  XMarkIcon, 
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
  
  const MediaSection = ({ formData, setFormData, errors }) => {
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Handle image upload logic here
        // For now, just create a preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            mainImage: reader.result
          }));
        };
        reader.readAsDataURL(file);
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