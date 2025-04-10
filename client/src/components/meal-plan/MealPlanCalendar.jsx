// MealPlanCalendar.jsx
import React from "react";

const MealPlanCalendar = ({ plan, onSlotSelect, onRemove }) => {
  const days = Object.keys(plan);

  return (
    <div className="meal-plan-calendar">
      <h3 className="text-2xl font-bold text-primary-700 mb-4">📆 Weekly Plan</h3>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day} className="bg-white p-4 shadow rounded-lg">
            <h4 className="text-lg font-semibold text-center mb-2">{day}</h4>
            {["breakfast", "lunch", "dinner"].map((meal) => (
              <div
                key={meal}
                className="border rounded-lg p-2 mb-2 cursor-pointer hover:bg-gray-50 relative group"
              >
                <div onClick={() => onSlotSelect(day, meal)}>
                  {plan[day][meal] ? (
                    <>
                      <p className="font-medium">{plan[day][meal].title}</p>
                      <p className="text-xs text-gray-500">{meal}</p>
                    </>
                  ) : (
                    <p className="text-gray-400 italic">+ Add {meal}</p>
                  )}
                </div>
                {plan[day][meal] && (
                  <button
                  onClick={() => onRemove(day, meal)}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-sm"
                    title="Remove"
                  >
                    ❌
                  </button>
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
