import React from "react";




const MealPlan = ({ recipes = [], onSelect }) => {
  return (
    <div className="meal-plan">
      <h3>🍽 Available Recipes</h3>
      <div className="recipe-list">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="recipe-card"
              onClick={() => onSelect(recipe)}
            >
              <img src={recipe.imageUrl} alt={recipe.title} />
              <p>{recipe.title}</p>
            </div>
          ))
        ) : (
          <p>No recipes available.</p>
        )}
      </div>
    </div>
  );
};

export default MealPlan;
