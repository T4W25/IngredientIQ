// src/components/meal plan/MealPlanCalendar.jsx
import React from "react";



const MealPlanCalendar = ({ plan, onSelectSlot }) => {
  if (!plan || typeof plan !== "object") {
    return <p className="empty-message">No meal plan data available.</p>;
  }

  const days = Object.keys(plan);

  return (
    <div className="meal-plan-calendar">
      <h3>📅 Weekly Meal Plan</h3>
      <div className="calendar-grid">
        {days.map((day) => (
          <div key={day} className="day-column">
            <h4>{day}</h4>
            {["breakfast", "lunch", "dinner"].map((meal) => (
              <div
                key={meal}
                className="meal-slot"
                onClick={() => onSelectSlot(day, meal)}
              >
                {plan[day]?.[meal] ? (
                  <span>{plan[day][meal].title}</span>
                ) : (
                  <span className="placeholder">+ Add {meal}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanCalendar;
