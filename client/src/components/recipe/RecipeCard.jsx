import React from "react";
import "./RecipeCard.css";
import { Link } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card">
      <img src={recipe.image} alt={recipe.title} />
      <h4>{recipe.title}</h4>
    </Link>
  );
};

export default RecipeCard;
