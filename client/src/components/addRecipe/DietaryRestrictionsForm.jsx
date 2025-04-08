// src/components/recipe/DietaryRestrictionsForm.jsx
import React from "react";
import { motion } from "framer-motion";
import { InformationCircleIcon } from '@heroicons/react/24/outline';

// Dietary options configuration
const DIETARY_OPTIONS = [
  { id: 'isVegetarian', label: 'Vegetarian', icon: '🥗' },
  { id: 'isVegan', label: 'Vegan', icon: '🌱' },
  { id: 'isGlutenFree', label: 'Gluten-Free', icon: '🌾' },
  { id: 'isDairyFree', label: 'Dairy-Free', icon: '🥛' },
  { id: 'isNutFree', label: 'Nut-Free', icon: '🥜' },
  { id: 'isKeto', label: 'Keto-Friendly', icon: '🥑' },
  { id: 'isPaleo', label: 'Paleo-Friendly', icon: '🍖' },
  { id: 'isLowCarb', label: 'Low-Carb', icon: '📉' }
];

// Checkbox component for dietary restrictions
const DietaryCheckbox = ({ id, label, icon, checked, onChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative flex items-center"
  >
    <div className="flex items-center h-12 px-4 rounded-lg border-2 
      border-gray-200 hover:border-primary-500 transition-colors duration-200
      cursor-pointer w-full group"
    >
      <input
        type="checkbox"
        id={id}
        name={id}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 text-primary-600 border-2 border-gray-300 
          rounded focus:ring-primary-500 focus:ring-offset-0 
          transition-colors duration-200 cursor-pointer"
      />
      <label
        htmlFor={id}
        className="ml-3 flex items-center cursor-pointer text-gray-700 
          group-hover:text-primary-600 transition-colors duration-200"
      >
        <span className="mr-2 text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
      </label>
    </div>
  </motion.div>
);

// Info Box component
const InfoBox = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-start p-4 bg-primary-50 rounded-xl"
  >
    <InformationCircleIcon className="w-5 h-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
    <p className="text-sm text-primary-700">{children}</p>
  </motion.div>
);

// Main DietaryRestrictionsForm component
const DietaryRestrictionsForm = ({ dietaryRestrictions, onChange }) => {
  // Handle individual checkbox changes
  const handleChange = (e) => {
    const { name, checked } = e.target;
    onChange({
      ...dietaryRestrictions,
      [name]: checked,
    });
  };

  // Handle "Select All" functionality
  const handleSelectAll = () => {
    const allSelected = Object.values(dietaryRestrictions).every(Boolean);
    const newValue = !allSelected;
    
    const updatedRestrictions = {};
    Object.keys(dietaryRestrictions).forEach(key => {
      updatedRestrictions[key] = newValue;
    });
    
    onChange(updatedRestrictions);
  };

  // Handle "Clear All" functionality
  const handleClearAll = () => {
    const clearedRestrictions = {};
    Object.keys(dietaryRestrictions).forEach(key => {
      clearedRestrictions[key] = false;
    });
    
    onChange(clearedRestrictions);
  };

  // Count selected options
  const selectedCount = Object.values(dietaryRestrictions).filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-primary-800">
          Dietary Restrictions
        </h2>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm text-primary-600 hover:text-primary-700 
              font-medium transition-colors duration-200"
          >
            Select All
          </button>
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-sm text-gray-500 hover:text-gray-700 
                font-medium transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Selected Count */}
      {selectedCount > 0 && (
        <div className="text-sm text-gray-600">
          {selectedCount} restriction{selectedCount !== 1 ? 's' : ''} selected
        </div>
      )}

      {/* Dietary Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DIETARY_OPTIONS.map(({ id, label, icon }) => (
          <DietaryCheckbox
            key={id}
            id={id}
            label={label}
            icon={icon}
            checked={dietaryRestrictions[id]}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* Child-Friendly Option */}
      <div className="pt-4 border-t border-gray-200">
        <DietaryCheckbox
          id="suitableForChildren"
          label="Suitable for Children"
          icon="👶"
          checked={dietaryRestrictions.suitableForChildren}
          onChange={handleChange}
        />
      </div>

      {/* Info Box */}
      <InfoBox>
        Marking dietary restrictions helps users with specific needs find your recipe.
        Only check the boxes if your recipe truly meets these requirements.
      </InfoBox>
    </div>
  );
};

export default DietaryRestrictionsForm;