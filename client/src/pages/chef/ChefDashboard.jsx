import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Navbar from "../../Components/navbar";
import { getAuthorProfile, getRecipes, deleteRecipe } from "../../api/api";

const DeleteModal = ({ recipe, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onCancel}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-2xl"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Recipe</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{recipe?.title}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  </div>
);

const ChefDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await getAuthorProfile(token);
        setProfile(profileRes.data);

        const recipesRes = await getRecipes();
        const myRecipes = recipesRes.data.filter(
          (r) => r.authorId === profileRes.data._id
        );
        setRecipes(myRecipes);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleDeleteClick = (recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  const handleDelete = async () => {
    try {
      await deleteRecipe(token, recipeToDelete._id);
      setRecipes((prev) => prev.filter((r) => r._id !== recipeToDelete._id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete recipe:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-800">Chef Dashboard</h1>
            {profile && (
              <p className="text-gray-600 mt-2">Welcome back, {profile.username}!</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/add-recipe"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg
                hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              New Recipe
            </Link>
            
            <button onClick={handleLogout}>
              <Link
                to="/auth"
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg
                  hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
              >
                Logout
              </Link>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">My Recipes</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : recipes.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't created any recipes yet.</p>
              <Link
                to="/add-recipe"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white 
                  rounded-lg hover:bg-primary-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Recipe
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Recipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recipes.map((recipe) => (
                    <tr key={recipe._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{recipe.title}</div>
                            <div className="text-sm text-gray-500">
                              {recipe.description?.slice(0, 60)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                          Published
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(recipe.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-3">
                          <button className="text-gray-600 hover:text-primary-600">
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button className="text-gray-600 hover:text-primary-600">
                            <ChartBarIcon className="w-5 h-5" />
                          </button>
                          <Link 
                            to={`/edit-recipe/${recipe._id}`}
                            className="text-gray-600 hover:text-primary-600"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </Link>
                          <button 
                            onClick={() => handleDeleteClick(recipe)}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          recipe={recipeToDelete}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default ChefDashboard;