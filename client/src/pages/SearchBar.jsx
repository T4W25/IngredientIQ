// src/components/Search.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Navbar from "../Components/navbar";

const DIETARY_OPTIONS = [
  { label: "Vegetarian", value: "isVegetarian", icon: "🥗" },
  { label: "Vegan", value: "isVegan", icon: "🌱" },
  { label: "Gluten Free", value: "isGlutenFree", icon: "🌾" },
  { label: "Dairy Free", value: "isDairyFree", icon: "🥛" },
  { label: "Nut Free", value: "isNutFree", icon: "🥜" },
  { label: "Keto", value: "isKeto", icon: "🥑" },
  { label: "Paleo", value: "isPaleo", icon: "🍖" },
  { label: "Low Carb", value: "isLowCarb", icon: "📉" },
  { label: "Child Friendly", value: "suitableForChildren", icon: "👶" },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const activeFiltersCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const searchParams = new URLSearchParams();
    if (query.trim()) searchParams.set("q", query.trim());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append("filter", key);
    });

    try {
      await navigate(`/searchresults?${searchParams.toString()}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <form onSubmit={handleSearch} className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-800">
              Recipe Finder
            </h1>
            <p className="text-gray-600">
              Discover delicious recipes tailored to your preferences
            </p>
          </div>

          {/* Search Input */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes (e.g., pasta, salad, chicken...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-primary pl-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">
                Dietary Preferences
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters({})}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map(({ label, value, icon }) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  key={value}
                  onClick={() => setFilters(prev => ({ ...prev, [value]: !prev[value] }))}
                  className={`filter-chip ${
                    filters[value] ? 'filter-chip-active' : 'filter-chip-inactive'
                  }`}
                >
                  <span>{icon}</span>
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span>Search Recipes</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
    </>
  );
};

export default Search;