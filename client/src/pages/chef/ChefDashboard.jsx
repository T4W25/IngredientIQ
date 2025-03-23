import React, { useEffect, useState } from "react";
import { getAuthorProfile, getRecipes, deleteRecipe } from "../../api/api";
import "./ChefDashboard.css";

const ChefDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
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
      }
    };

    fetchData();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await deleteRecipe(token, id);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete recipe:", err);
    }
  };

  return (
    <div className="chef-dashboard">
      <h1>👨‍🍳 Chef Dashboard</h1>

      {profile && (
        <div className="chef-profile">
          <h2>Welcome, {profile.username}!</h2>
          <p>Email: {profile.email}</p>
        </div>
      )}

      <div className="dashboard-actions">
        <button onClick={() => window.location.href = "/submit-recipe"}>
          ➕ Submit New Recipe
        </button>
      </div>

      <div className="chef-recipes">
        <h2>📋 Your Recipes</h2>
        {recipes.length === 0 ? (
          <p>You haven't added any recipes yet.</p>
        ) : (
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <div className="recipe-card" key={recipe._id}>
                <img src={recipe.imageUrl} alt={recipe.title} />
                <h4>{recipe.title}</h4>
                <p>{recipe.description?.slice(0, 60)}...</p>
                <div className="recipe-actions">
                  <button onClick={() => window.location.href = `/edit-recipe/${recipe._id}`}>✏️ Edit</button>
                  <button onClick={() => handleDelete(recipe._id)}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefDashboard;
