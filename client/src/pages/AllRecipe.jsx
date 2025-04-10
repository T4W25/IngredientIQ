// pages/AllRecipes.jsx
import React, { useState, useEffect } from 'react';
import { getRecipes } from '../api/api';
import RecipeCard from '../Components/recipe/RecipeCard';
import FilterSection from '../Components/recipe/FilterSection';
import LoadingSpinner from '../Components/ui/LoadingSpinner';
import Navbar from '../Components/navbar';

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    cuisine: '',
    difficulty: '',
    dietary: '',
    searchQuery: '',
  });

  useEffect(() => {
    fetchRecipes();
  }, [filters]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await getRecipes(filters);
      setRecipes(response.data);
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
        
        <FilterSection filters={filters} setFilters={setFilters} />

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
                No recipes found matching your criteria.
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