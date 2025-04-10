import React, { useState, useEffect } from 'react';
import { getRecipes } from '../api/api';
import RecipeCard from '../components/recipe/RecipeCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Navbar from '../components/ui/navbar';

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await getRecipes(); // No filters for now
      setRecipes(response.data); // Assuming Axios response
      setError(null);
    } catch (error) {
      setError('Failed to fetch recipes. Please try again later.');
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Discover Recipes</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8">
                No recipes found.
              </div>
            ) : (
              recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRecipes;
