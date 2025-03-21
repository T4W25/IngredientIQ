import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "../components/authorization/Auth";
import Home from "../pages/home/Home";
import Bookmarks from "../pages/bookmarks/Bookmarks";
import MealPlanDashboard from "../pages/mealplan/MealPlanDashboard";
import SearchResults from "../pages/searchresults/SearchResults";
import Recipe from "../components/recipe/Recipe";
import Profile from "../components/profile/Profile";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<Auth />} />
    <Route path="/" element={<Navigate to="/home" />} />
    <Route
      path="/home"
      element={
        <ProtectedRoute>
          <Home />
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
