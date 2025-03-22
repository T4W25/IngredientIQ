import React, { useEffect, useState } from "react";
import { getMealPlans } from "../../api/api";

const MealPlanDashboard = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await getMealPlans(token);
        setMealPlans(response.data);
      } catch (error) {
        console.error("Error fetching meal plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🍽️ Your Meal Plan Dashboard</h2>

      {loading ? (
        <p>Loading meal plans...</p>
      ) : mealPlans.length === 0 ? (
        <p>No meal plans created yet. Start planning your meals!</p>
      ) : (
        <ul>
          {mealPlans.map((plan) => (
            <li key={plan._id} style={{ marginBottom: "1rem" }}>
              <strong>{plan.planType}</strong> | From:{" "}
              {new Date(plan.startDate).toLocaleDateString()} to{" "}
              {new Date(plan.endDate).toLocaleDateString()}
              <ul>
                {plan.recipes.map((r, index) => (
                  <li key={index}>
                    🍲 {r.recipeId} - {r.servings} servings
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MealPlanDashboard;
