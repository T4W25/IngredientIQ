import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add this import
import { getRecipes } from '../api/api';
import Navbar from '../components/ui/navbar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '../Components/ui/card'; // Keep this import only once

const AllRecipes = () => {
  const navigate = useNavigate(); // Add this
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await getRecipes();
      setRecipes(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch recipes. Please try again later.');
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle card click
  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Recipes</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8">
                No recipes found.
              </div>
            ) : (
              recipes.map((recipe) => (
                <Card 
                  key={recipe._id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleRecipeClick(recipe._id)}
                >
                  <CardHeader>
                    <img
                      src={recipe.mainImage || 'https://via.placeholder.com/400x300'}
                      alt={recipe.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <CardTitle className="mt-4">{recipe.title}</CardTitle>
                    <CardDescription>{recipe.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{recipe.authorId?.username || 'Anonymous'}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Prep: {recipe.prepTime}m | Cook: {recipe.cookTime}m
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{recipe.difficulty}</span>
                      <span className="text-sm text-muted-foreground">
                        {recipe.nutritionalInfo?.calories || 0} calories
                      </span>
                    </div>

                    {/* Dietary Restrictions Tags */}
                    {recipe.dietaryRestrictions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(recipe.dietaryRestrictions)
                          .filter(([_, value]) => value === true)
                          .map(([key]) => (
                            <span
                              key={key}
                              className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs"
                            >
                              {key.replace('is', '').replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Rating */}
                    {recipe.averageRating > 0 && (
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-sm text-yellow-500">★</span>
                        <span className="text-sm">{recipe.averageRating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">
                          ({recipe.totalRatings} {recipe.totalRatings === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRecipes;
