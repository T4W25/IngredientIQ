import React, { useState, useEffect } from 'react';

const Recipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  // Fetch recipes from API or static data
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Replace with your API endpoint to fetch recipes
        const response = await fetch('/api/recipes');
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="recipes-container">
      <h2>Recipes</h2>

      {error && <div className="error">{error}</div>}

      <div className="recipes-list">
        {recipes.length === 0 ? (
          <p>No recipes available.</p>
        ) : (
          recipes.map((recipe, index) => (
            <div key={index} className="recipe-card">
              <h3>{recipe.title}</h3>
              <div className="ingredients">
                <h4>Ingredients:</h4>
                <ul>
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="instructions">
                <h4>Instructions:</h4>
                <p>{recipe.instructions}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Recipe;
