// components/RecipeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <img
            src={recipe.mainImage}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 px-2 py-1 bg-white rounded-full text-sm">
            {recipe.totalTime} min
          </div>
        </div>
        
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
            {recipe.title}
          </h2>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {recipe.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 bg-gray-100 text-sm rounded-full">
              {recipe.category}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-sm rounded-full">
              {recipe.difficulty}
            </span>
            {/* {recipe.dietaryRestrictions.isVegetarian && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Vegetarian
              </span>
            )} */}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-gray-600">
                {recipe.servings} servings
              </span>
            </div>
            {/* <div className="flex items-center">
              <span className="text-sm text-gray-600">
                {recipe.nutritionalInfo.calories} cal
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;