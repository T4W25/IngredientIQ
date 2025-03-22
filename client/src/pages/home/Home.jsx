import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Ingredient IQ</h1>
      <p>Your personalized ingredient discovery and recipe planner.</p>
      <button onClick={() => alert("Feature coming soon!")}>Explore Recipes</button>
    </div>
  );
};

export default Home;
