// components/FilterSection.jsx
import React from 'react';

const FilterSection = ({ filters, setFilters }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <input
          type="text"
          name="searchQuery"
          placeholder="Search recipes..."
          className="border rounded-md p-2 w-full"
          value={filters.searchQuery}
          onChange={handleFilterChange}
        />
        
        <select
          name="category"
          className="border rounded-md p-2 w-full"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="appetizer">Appetizer</option>
          <option value="dessert">Dessert</option>
          <option value="snack">Snack</option>
        </select>

        <select
          name="difficulty"
          className="border rounded-md p-2 w-full"
          value={filters.difficulty}
          onChange={handleFilterChange}
        >
          <option value="">All Difficulty Levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          name="dietary"
          className="border rounded-md p-2 w-full"
          value={filters.dietary}
          onChange={handleFilterChange}
        >
          <option value="">All Dietary Types</option>
          <option value="isVegetarian">Vegetarian</option>
          <option value="isVegan">Vegan</option>
          <option value="isGlutenFree">Gluten-Free</option>
          <option value="isDairyFree">Dairy-Free</option>
          <option value="isKeto">Keto</option>
          <option value="isPaleo">Paleo</option>
          <option value="isLowCarb">Low Carb</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSection;