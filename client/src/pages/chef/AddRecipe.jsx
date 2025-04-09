// src/components/recipe/AddRecipe.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  PlusIcon, 
  ArrowLeftIcon,
  XMarkIcon, 
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import BasicInfoSection from "../../Components/addRecipe/BasicInfoSection";
import MediaSection from "../../Components/addRecipe/mediaSection";  
import IngredientsSection from "../../Components/addRecipe/IngredientSection";
import InstructionsSection from "../../Components/addRecipe/InstructionSection";

// Import your existing components
import DietaryRestrictionsForm from "../../Components/addRecipe/DietaryRestrictionsForm";
import NutritionalInfoForm from "../../Components/addRecipe/NutritionalInfoForm";

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  prepTime: 0,
  cookTime: 0,
  servings: 1,
  difficulty: "easy",
  cuisine: "",
  category: "",
  mainImage: "",
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

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.mainImage) newErrors.mainImage = "Main image is required";
    
    // Validate ingredients
    if (formData.ingredients.some(ing => !ing.name.trim() || !ing.quantity)) {
      newErrors.ingredients = "All ingredients must have a name and quantity";
    }
    
    // Validate instructions
    if (formData.instructions.some(inst => !inst.text.trim())) {
      newErrors.instructions = "All instructions must have text";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Add your API call here
      await submitRecipe(formData);
      navigate("/chef-dashboard");
    } catch (error) {
      console.error("Error submitting recipe:", error);
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
            {/* Form Header */}
            <div className="flex items-center gap-4">
              <Link
                to="/chef-dashboard"
                className="p-2 text-gray-600 hover:text-primary-600 
                  transition-colors rounded-lg hover:bg-primary-50"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h1 className="text-3xl font-bold text-primary-800">
                Create New Recipe
              </h1>
              <p className="text-gray-600 mt-2">
                Share your culinary masterpiece with the world
              </p>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <BasicInfoSection 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />

              {/* Media Upload Section */}
              <MediaSection 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />

              {/* Ingredients Section */}
              <IngredientsSection 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />

              {/* Instructions Section */}
              <InstructionsSection 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />

              {/* Nutritional Information */}
              <NutritionalInfoForm 
                nutritionalInfo={formData.nutritionalInfo}
                onChange={(nutritionalInfo) => 
                  setFormData(prev => ({ ...prev, nutritionalInfo }))
                }
              />

              {/* Dietary Restrictions */}
              <DietaryRestrictionsForm 
                dietaryRestrictions={formData.dietaryRestrictions}
                onChange={(dietaryRestrictions) => 
                  setFormData(prev => ({ ...prev, dietaryRestrictions }))
                }
              /> 

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 
                    transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 bg-primary-600 text-white rounded-lg
                    hover:bg-primary-700 transition-colors duration-200
                    flex items-center gap-2 ${isLoading ? 'opacity-70' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Saving...</span>
                    </>
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