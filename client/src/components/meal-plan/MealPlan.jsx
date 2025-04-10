import React from "react";

const MealPlan = ({ day, meal, recipes, onSelect }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-lg font-bold text-primary-600 mb-4">
        Select Recipe for {meal} on {day}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipes.map((r) => (
          <div
            key={r._id}
            className="border rounded-lg p-3 hover:shadow-lg cursor-pointer bg-white"
            onClick={() => onSelect(r)}
          >
            <img src={r.mainImage} alt={r.title} className="h-32 w-full object-cover rounded" />
            <h4 className="text-sm font-medium mt-2">{r.title}</h4>
            <p className="text-xs text-gray-500">{r.cuisine}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlan;
