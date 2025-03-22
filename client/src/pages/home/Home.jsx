import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import sampleRecipes from "../../assets/sampleRecipes"; // You'll create this
import RecipeCard from "../../components/recipe/RecipeCard"; // Make sure it exists

const Home = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/auth"; // or use navigate("/auth");
      };
      
  return (
    <div className="home">
      {/* HEADER */}
      <div className="header">
  <div className="left">
    <h2>Ingredient IQ</h2>
    <input type="text" placeholder="Search recipes..." className="search-input" />
  </div>
  <nav className="nav-links">
  <Link to="/">Home</Link>
    <a href="/recipes">Recipes</a>
    <a href="/bookmarks">Bookmarks</a>
    <a href="/mealplans">Meal Plans</a>
    <a href="/profile">Profile</a>
    <button onClick={handleLogout}>Logout</button>
  </nav>
</div>


      {/* HERO SECTION */}
      <section className="hero">
        <h2>Discover Recipes. Plan Meals. Get Inspired.</h2>
        <p>Your personalized ingredient discovery and recipe planner.</p>
        <Link to="/recipes">
          <button className="explore-btn">Explore Recipes</button>
        </Link>
      </section>

      {/* FEATURED RECIPE GRID */}
      <section className="recipe-section">
        <h3>Featured Recipes</h3>
        <div className="recipe-grid">
          {sampleRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Ingredient IQ</p>
      </footer>
    </div>
  );
};

export default Home;
