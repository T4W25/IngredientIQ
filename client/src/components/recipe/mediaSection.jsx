import React from "react";
import { toast } from "react-toastify";
import { PhotoIcon } from '@heroicons/react/24/outline';
import { handleFileUpload } from "../../api/api"; // Ensure this is correctly implemented

const MediaSection = ({ formData, setFormData, errors }) => {
  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file size
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Only JPEG, PNG and JPG are allowed.');
        return;
      }

      const fileData = new FormData();
      fileData.append('image', file);

      const response = await handleFileUpload(fileData); // API call to upload the image
      if (response?.data?.url) {
        setFormData(prev => ({ ...prev, mainImage: response.data.url })); // Update formData with the image URL
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
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
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageUpload}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG up to 5MB
            </p>
            {formData.mainImage && (
              <p className="text-sm text-green-600">
                Image uploaded successfully ✓
              </p>
            )}
          </div>
        </div>
        {errors.mainImage && (
          <p className="mt-1 text-sm text-red-500">{errors.mainImage}</p>
        )}
      </div>
    </div>
  );
};

export default MediaSection;
