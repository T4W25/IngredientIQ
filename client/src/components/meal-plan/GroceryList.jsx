import React from "react";

const GroceryList = ({ plan }) => {
  const groceryMap = {};

  Object.values(plan).forEach(dayMeals => {
    Object.values(dayMeals).forEach(recipe => {
      if (recipe && Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(({ name, quantity, unit }) => {
          const parsedQty = parseFloat(quantity);
          if (!groceryMap[name]) {
            groceryMap[name] = { quantity: parsedQty, unit };
          } else {
            groceryMap[name].quantity += parsedQty;
          }
        });
      }
    });
  });

  const items = Object.entries(groceryMap).map(([ingredient, { quantity, unit }]) => ({
    ingredient,
    quantity: Math.round(quantity * 10) / 10,
    unit
  }));

  return (
    <div className="bg-white p-6 mt-8 rounded-xl shadow-lg">
      <h2 className="text-lg font-bold text-primary-600 mb-4">🛒 Grocery List</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No groceries added yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((item, idx) => (
            <li key={idx} className="py-2 flex justify-between items-center">
              <span className="text-gray-700">{item.ingredient}</span>
              <span className="text-sm text-gray-600">{item.quantity} {item.unit}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroceryList;
