import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  ArrowLeftIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import {
  getRecipeById,
  updateRecipe,
  handleFileUpload,
} from "../../api/api";
import BasicInfoSection from "../../components/recipe/BasicInfoSection";
import MediaSection from "../../components/recipe/MediaSection";
import IngredientsSection from "../../components/recipe/IngredientSection";
import InstructionsSection from "../../components/recipe/InstructionSection";
import DietaryRestrictionsForm from "../../components/recipe/DietaryRestrictionsForm";
import NutritionalInfoForm from "../../components/recipe/NutritionalInfoForm";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await getRecipeById(id);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        toast.error("Failed to load recipe");
      }
    };
    fetchRecipe();
  }, [id]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return toast.error("Please fix the errors");
    setIsLoading(true);

    try {
      let updatedMainImage = formData.mainImage;
      if (formData.mainImage instanceof File) {
        const imageForm = new FormData();
        imageForm.append("image", formData.mainImage);
        const uploadRes = await handleFileUpload(imageForm);
        updatedMainImage = uploadRes.data.url;
      }

      const updatedData = {
        ...formData,
        mainImage: updatedMainImage,
        ingredients: formData.ingredients.filter(ing => ing.name.trim() && ing.quantity && ing.unit),
        instructions: formData.instructions.filter(inst => inst.text.trim()).map((inst, i) => ({ ...inst, step: i + 1 }))
      };
    
      console.log("Updating with:", updatedData);
      
      await updateRecipe(token, id, updatedData);
      toast.success("Recipe updated successfully!");
      navigate("/chef-dashboard");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update recipe");
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex items-center gap-4">
            <Link to="/chef-dashboard" className="p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h1 className="text-3xl font-bold text-primary-800">Edit Recipe</h1>
            <p className="text-gray-600 mt-2">Update your culinary creation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <BasicInfoSection formData={formData} setFormData={setFormData} errors={errors} />
            <MediaSection formData={formData} setFormData={setFormData} errors={errors} handleFileChange={handleFileChange} />
            <IngredientsSection formData={formData} setFormData={setFormData} errors={errors} />
            <InstructionsSection formData={formData} setFormData={setFormData} errors={errors} />
            <NutritionalInfoForm nutritionalInfo={formData.nutritionalInfo} onChange={(nutritionalInfo) => setFormData(prev => ({ ...prev, nutritionalInfo }))} />
            <DietaryRestrictionsForm dietaryRestrictions={formData.dietaryRestrictions} onChange={(dietaryRestrictions) => setFormData(prev => ({ ...prev, dietaryRestrictions }))} />

            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 text-gray-600 hover:text-gray-800">Cancel</button>
              <button type="submit" disabled={isLoading} className={`px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 ${isLoading ? 'opacity-70' : ''}`}>
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <>
                    <PencilIcon className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditRecipe;