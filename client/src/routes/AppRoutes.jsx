import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "../Components/authorization/Auth";  
import Home from "../pages/Home";
import Bookmarks from "../pages/Bookmarks";
import MealPlanDashboard from "../pages/mealplan/MealPlanDashboard";
import SearchResults from "../pages/SearchResults";
import Search from "../pages/SearchBar"; // ✅ CORRECT!
import Recipe from "../components/recipe/Recipe";
import Profile from "../components/profile/Profile";
import ChefDashboard from "../pages/chef/ChefDashboard";
import Landing from "../Components/landingpage";
import AddRecipe from "../pages/chef/AddRecipe";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" index element={<Navigate to="/landing" />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/landing" element={<Landing />} />
    <Route
      path="/home"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />
    <Route
      path="/chef-dashboard"
      element={
        <ProtectedRoute>
          <ChefDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/add-recipe"
      element={
        <ProtectedRoute>
          <AddRecipe/>
        </ProtectedRoute>
      }
    />
    <Route
      path="/recipes"
      element={
        <ProtectedRoute>
          <Recipe />
        </ProtectedRoute>
      }
    />
    <Route
      path="/bookmarks"
      element={
        <ProtectedRoute>
          <Bookmarks />
        </ProtectedRoute>
      }
    />
    <Route
      path="/mealplans"
      element={
        <ProtectedRoute>
          <MealPlanDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/search"
      element={
        <ProtectedRoute>
          <Search/>
        </ProtectedRoute>
      }
    />
    <Route
      path="/searchresults"
      element={
        <ProtectedRoute>
          <SearchResults />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
