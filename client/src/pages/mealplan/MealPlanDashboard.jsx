// src/pages/mealplan/MealPlanDashboard.jsx
import React, { useEffect, useState } from "react";
import MealPlan from "../../components/meal-plan/MealPlan";
import GroceryList from "../../components/meal-plan/GroceryList";
import MealPlanCalendar from "../../components/meal-plan/MealPlanCalendar";
import { getBookmarks } from "../../api/api";


const defaultPlan = {
  Monday: { breakfast: null, lunch: null, dinner: null },
  Tuesday: { breakfast: null, lunch: null, dinner: null },
  Wednesday: { breakfast: null, lunch: null, dinner: null },
  Thursday: { breakfast: null, lunch: null, dinner: null },
  Friday: { breakfast: null, lunch: null, dinner: null },
  Saturday: { breakfast: null, lunch: null, dinner: null },
  Sunday: { breakfast: null, lunch: null, dinner: null },
};

const MealPlanDashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [plan, setPlan] = useState(defaultPlan);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getBookmarks(token);
        setRecipes(res.data);
      } catch (err) {
        console.error("Failed to load bookmarks", err);
      }
    };
    fetchBookmarks();
  }, []);

  const handleSelectSlot = (day, meal) => {
    setSelectedSlot({ day, meal });
  };

  const handleAssignRecipe = (recipe) => {
    if (!selectedSlot) return;
    const updated = { ...plan };
    updated[selectedSlot.day][selectedSlot.meal] = recipe;
    setPlan(updated);
    setSelectedSlot(null);
  };

  return (
    <div className="meal-plan-dashboard">
      <h1>🍽 Meal Planning Dashboard</h1>

      <MealPlan recipes={recipes} onSelect={handleAssignRecipe} />

      <MealPlanCalendar plan={plan} onSelectSlot={handleSelectSlot} />

      <GroceryList plan={plan} />
    </div>
  );
};

export default MealPlanDashboard;