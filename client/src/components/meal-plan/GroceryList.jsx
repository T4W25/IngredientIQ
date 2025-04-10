// src/components/meal plan/GroceryList.jsx
import React from "react";



const GroceryList = ({ plan }) => {
  if (!plan || typeof plan !== "object") {
    return <p className="empty-message">No grocery list available yet.</p>;
  }

  // Flatten all ingredients from the meal plan
  const allIngredients = Object.values(plan).flatMap(day =>
    Object.values(day)
      .filter(Boolean)
      .flatMap(recipe => recipe.ingredients || [])
  );

  // Group ingredients by category (e.g., vegetable, dairy, etc.)
  const categorized = allIngredients.reduce((acc, item) => {
    const category = item.category || "Other";
    acc[category] = acc[category] || [];
    acc[category].push(item.name);
    return acc;
  }, {});

  return (
    <div className="grocery-list">
      <h3>🛒 Grocery List</h3>
      {Object.entries(categorized).map(([category, items]) => (
        <div key={category} className="grocery-category">
          <h4>{category}</h4>
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>
                <input type="checkbox" /> {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default GroceryList;
