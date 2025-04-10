import React, { useEffect, useState } from "react";
import MealPlan from "../../components/meal-plan/MealPlan";
import GroceryList from "../../components/meal-plan/GroceryList";
import MealPlanCalendar from "../../components/meal-plan/MealPlanCalendar";
import {
  getRecipes,
  createMealPlan,
  getMealPlans
} from "../../api/api";
import Navbar from "../../components/ui/navbar";
import { toast } from "react-toastify";

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
  const [plan, setPlan] = useState(defaultPlan);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRecipes();
        setRecipes(res.data);
  
        const saved = await getMealPlans(token);
        const today = new Date();
  
        const matchingPlan = saved.data.find(plan => {
          const start = new Date(plan.startDate);
          const end = new Date(plan.endDate);
          return today >= start && today <= end;
        });
  
        if (matchingPlan) {
          setPlan(convertToUIPlan(matchingPlan.recipes));
        } else {
          setPlan(defaultPlan); // fallback to blank plan if no match
        }
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
  
    fetchData();
  }, []);  

  const convertToUIPlan = (recipesArray) => {
    const newPlan = JSON.parse(JSON.stringify(defaultPlan));
    recipesArray.forEach(({ day, meal, recipe }) => {
      if (newPlan[day]) newPlan[day][meal] = recipe;
    });
    return newPlan;
  };

  const handleSlotSelect = (day, meal) => setSelectedSlot({ day, meal });

  const assignRecipeToSlot = (recipe) => {
    if (!selectedSlot) return;
    const updated = {
      ...plan,
      [selectedSlot.day]: {
        ...plan[selectedSlot.day],
        [selectedSlot.meal]: recipe
      }
    };
    setPlan(updated);
    setSelectedSlot(null);
  };

  const handleRemoveRecipe = (day, meal) => {
    setPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: null
      }
    }));
  };

  const handleSavePlan = async () => {
    const flatPlan = [];
    Object.entries(plan).forEach(([day, meals]) => {
      Object.entries(meals).forEach(([meal, recipe]) => {
        if (recipe) {
          flatPlan.push({ day, meal, recipeId: recipe._id, servings: recipe.servings || 1 });
        }
      });
    });

    console.log("Saving to backend:", flatPlan); // ✅ Add this line

    try {
      await createMealPlan(token, {
        planType: "Weekly",
        startDate: new Date(),
        endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        recipes: flatPlan
      });
      toast.success("Meal plan saved successfully!");
    } catch (err) {
      console.error("Failed to save meal plan", err);
      toast.error("Failed to save meal plan");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-2 md:pt-4 lg:pt-0">
  <Navbar />
  <div className="max-w-7xl mx-auto py-20 px-4 space-y-1 mt-0">
    <h1 className="text-3xl font-bold text-center text-primary-800">📅 Meal Planning</h1>

    <MealPlanCalendar
      plan={plan}
      onSlotSelect={handleSlotSelect}
      onRemove={handleRemoveRecipe}
    />

    {selectedSlot && (
      <MealPlan
        day={selectedSlot.day}
        meal={selectedSlot.meal}
        recipes={recipes}
        onSelect={assignRecipeToSlot}
      />
    )}

    <GroceryList plan={plan} />
  </div>

  <div className="text-center my-12">
    <button
      onClick={handleSavePlan}
      className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition"
    >
      💾 Save Meal Plan
    </button>
  </div>
</div>

  );
};

export default MealPlanDashboard;
