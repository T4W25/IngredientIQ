import React, { useState, useEffect } from "react";
import { getRecipes } from "../../api/api";
import { useLocation } from "react-router-dom";
import RecipeCard from "../../components/recipe/RecipeCard";

const SearchResults = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const filters = { query };
        const response = await getRecipes(filters);
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [query]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🔍 Search Results for "{query}"</h2>

      {loading ? (
        <p>Loading...</p>
      ) : recipes.length === 0 ? (
        <p>No recipes found. Try a different keyword!</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
