import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import BasicInfoSection from "../../Components/recipe/BasicInfoSection";
import MediaSection from "../../Components/recipe/mediaSection";  
import IngredientsSection from "../../Components/recipe/IngredientSection";
import InstructionsSection from "../../Components/recipe/InstructionSection";
import DietaryRestrictionsForm from "../../Components/recipe/DietaryRestrictionsForm";
import NutritionalInfoForm from "../../Components/recipe/NutritionalInfoForm";
import { createRecipe as addRecipe } from "../../api/api";

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  prepTime: 0,
  cookTime: 0,
  servings: 1,
  difficulty: "easy",
  cuisine: "",
  category: "",
  mainImage: null, // Image will be stored here
  gallery: [],
  ingredients: [{ name: "", quantity: "", unit: "" }],
  instructions: [{ step: 1, text: "", image: "" }],
  nutritionalInfo: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0,
    fiber: 0,
    sodium: 0,
  },
  dietaryRestrictions: {
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: false,
    isKeto: false,
    isPaleo: false,
    isLowCarb: false,
    suitableForChildren: false,
  },
};

const AddRecipe = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file changes for main image
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0], // Store the file here
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.mainImage) newErrors.mainImage = "Main image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsLoading(true);
    const recipeFormData = new FormData();

    // Append form data including the image
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "mainImage" && value) {
        recipeFormData.append(key, value); // Append image file
      } else if (key !== "gallery") {
        recipeFormData.append(key, value);
      }
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to create a recipe');
        navigate('/auth');
        return;
      }

      await addRecipe(token, recipeFormData); // Send form data with image
      toast.success('Recipe created successfully!');
      navigate("/chef-dashboard");
    } catch (error) {
      console.error("Error submitting recipe:", error);
      toast.error(error.response?.data?.error || 'Failed to create recipe');
      setErrors({ submit: "Failed to submit recipe. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <Link
                to="/chef-dashboard"
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h1 className="text-3xl font-bold text-primary-800">Create New Recipe</h1>
              <p className="text-gray-600 mt-2">Share your culinary masterpiece with the world</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <BasicInfoSection 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                handleInputChange={handleInputChange}
              />
              <MediaSection 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                handleFileChange={handleFileChange}
              />
              <IngredientsSection 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
              <InstructionsSection 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
              <NutritionalInfoForm 
                nutritionalInfo={formData.nutritionalInfo}
                onChange={(nutritionalInfo) => 
                  setFormData(prev => ({ ...prev, nutritionalInfo }))
                }
              />
              <DietaryRestrictionsForm 
                dietaryRestrictions={formData.dietaryRestrictions}
                onChange={(dietaryRestrictions) => 
                  setFormData(prev => ({ ...prev, dietaryRestrictions }))
                }
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2 ${isLoading ? 'opacity-70' : ''}`}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  ) : (
                    <>
                      <PlusIcon className="w-5 h-5" />
                      <span>Create Recipe</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AddRecipe;
