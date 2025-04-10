// BasicInfoSection Component
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const BasicInfoSection = ({ formData, setFormData, errors }) => {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-primary-800">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Title*
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                title: e.target.value
              }))}
              placeholder="Enter recipe title"
              className={`w-full px-4 py-2 rounded-lg border-2 
                ${errors.title ? 'border-red-500' : 'border-gray-200'}
                focus:outline-none focus:ring-2 focus:ring-primary-500 
                focus:border-transparent transition-all duration-200`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
  
          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description*
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              rows={3}
              placeholder="Describe your recipe"
              className={`w-full px-4 py-2 rounded-lg border-2 
                ${errors.description ? 'border-red-500' : 'border-gray-200'}
                focus:outline-none focus:ring-2 focus:ring-primary-500 
                focus:border-transparent transition-all duration-200`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
  
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                category: e.target.value
              }))}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200
                focus:outline-none focus:ring-2 focus:ring-primary-500 
                focus:border-transparent transition-all duration-200"
            >
              <option value="">Select Category</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="appetizer">Appetizer</option>
              <option value="dessert">Dessert</option>
              <option value="snack">Snack</option>
            </select>
          </div>
  
          {/* Cuisine */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine
            </label>
            <input
              type="text"
              value={formData.cuisine}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                cuisine: e.target.value
              }))}
              placeholder="e.g., Italian, Indian, Mexican"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200
                focus:outline-none focus:ring-2 focus:ring-primary-500 
                focus:border-transparent transition-all duration-200"
            />
          </div>
  
          {/* Time and Servings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preparation Time (minutes)
            </label>
            <input
              type="number"
              value={formData.prepTime}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                prepTime: parseInt(e.target.value) || 0
              }))}
              min="0"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200
                focus:outline-none focus:ring-2 focus:ring-primary-500 
                focus:border-transparent transition-all duration-200"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cooking Time (minutes)
            </label>
            <input
              type="number"
              value={formData.cookTime}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                cookTime: parseInt(e.target.value) || 0
              }))}
              min="0"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200
                focus:outline-none focus:ring-2 focus:ring-primary-500 
                focus:border-transparent transition-all duration-200"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servings
            </label>
            <input
              type="number"
              value={formData.servings}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                servings: parseInt(e.target.value) || 1
              }))}
              min="1"
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200
                focus:outline-none focus:ring-2 focus:ring-primary-500 
                focus:border-transparent transition-all duration-200"
            />
          </div>
  
          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                difficulty: e.target.value
              }))}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200
                focus:outline-none focus:ring-2 focus:ring-primary-500 
                focus:border-transparent transition-all duration-200"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>
    );
  };
  
export default BasicInfoSection;

