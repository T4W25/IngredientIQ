// src/pages/search/Search.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const dietaryOptions = [
  { label: "Vegetarian", value: "isVegetarian" },
  { label: "Vegan", value: "isVegan" },
  { label: "Gluten Free", value: "isGlutenFree" },
  { label: "Dairy Free", value: "isDairyFree" },
  { label: "Nut Free", value: "isNutFree" },
  { label: "Keto", value: "isKeto" },
  { label: "Paleo", value: "isPaleo" },
  { label: "Low Carb", value: "isLowCarb" },
  { label: "Child Friendly", value: "suitableForChildren" },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const searchParams = new URLSearchParams();
    if (query) searchParams.set("q", query);

    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append("filter", key);
    });

    navigate(`/searchresults?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white p-6">
      <form onSubmit={handleSearch} className="bg-white shadow-xl p-8 rounded-xl w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-green-800">Find a Recipe 🍽️</h1>

        <input
          type="text"
          placeholder="Search by keyword (e.g. pasta, salad...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <div>
          <h2 className="font-semibold mb-2 text-gray-700">Dietary Restrictions</h2>
          <div className="flex flex-wrap gap-3">
            {dietaryOptions.map(({ label, value }) => (
              <button
                type="button"
                key={value}
                onClick={() => toggleFilter(value)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  filters[value]
                    ? "bg-green-500 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300"
                } transition`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
        >
          Search Recipes
        </button>
      </form>
    </div>
  );
};

export default Search;
