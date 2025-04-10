// src/components/recipe/NutritionalInfoForm.jsx
import React from "react";
import { motion } from "framer-motion";
import { InformationCircleIcon } from '@heroicons/react/24/outline';


// Nutritional fields configuration
const NUTRITIONAL_FIELDS = [
  { 
    id: 'calories', 
    label: 'Calories', 
    unit: 'kcal',
    step: 1,
    icon: '🔥'
  },
  { 
    id: 'protein', 
    label: 'Protein', 
    unit: 'g',
    step: 0.1,
    icon: '🥩'
  },
  { 
    id: 'carbs', 
    label: 'Carbohydrates', 
    unit: 'g',
    step: 0.1,
    icon: '🍚'
  },
  { 
    id: 'fat', 
    label: 'Fat', 
    unit: 'g',
    step: 0.1,
    icon: '🥑'
  },
  { 
    id: 'sugar', 
    label: 'Sugar', 
    unit: 'g',
    step: 0.1,
    icon: '🍯'
  },
  { 
    id: 'fiber', 
    label: 'Fiber', 
    unit: 'g',
    step: 0.1,
    icon: '🌾'
  },
  { 
    id: 'sodium', 
    label: 'Sodium', 
    unit: 'mg',
    step: 1,
    icon: '🧂'
  }
];

// Input Field component with unit
const NutritionalInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  unit, 
  step, 
  icon 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-2"
  >
    <label 
      htmlFor={id} 
      className="flex items-center text-sm font-medium text-gray-700"
    >
      <span className="mr-2">{icon}</span>
      {label}
    </label>
    <div className="relative">
      <input
        type="number"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        min="0"
        step={step}
        className="w-full px-4 py-2 pr-12 rounded-lg border-2 border-gray-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 
          focus:border-transparent transition-all duration-200"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span className="text-gray-500 text-sm">{unit}</span>
      </div>
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
    <InformationCircleIcon 
      className="w-5 h-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" 
    />
    <p className="text-sm text-primary-700">{children}</p>
  </motion.div>
);

// Summary Card component
const NutritionalSummary = ({ nutritionalInfo }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-primary-50 p-4 rounded-xl"
  >
    <h3 className="text-primary-800 font-semibold mb-3">Nutritional Summary</h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary-600">
          {nutritionalInfo.calories}
        </div>
        <div className="text-sm text-primary-700">Calories</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary-600">
          {nutritionalInfo.protein}g
        </div>
        <div className="text-sm text-primary-700">Protein</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary-600">
          {nutritionalInfo.carbs}g
        </div>
        <div className="text-sm text-primary-700">Carbs</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary-600">
          {nutritionalInfo.fat}g
        </div>
        <div className="text-sm text-primary-700">Fat</div>
      </div>
    </div>
  </motion.div>
);

// Main NutritionalInfoForm component
const NutritionalInfoForm = ({ nutritionalInfo, onChange }) => {
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert to number and handle invalid inputs
    const numValue = parseFloat(value);
    const validValue = !isNaN(numValue) && numValue >= 0 ? numValue : 0;

    onChange({
      ...nutritionalInfo,
      [name]: validValue,
    });
  };

  // Handle bulk update
  const handleBulkUpdate = (values) => {
    onChange({
      ...nutritionalInfo,
      ...values
    });
  };

  // Reset all values
  const handleReset = () => {
    const resetValues = {};
    Object.keys(nutritionalInfo).forEach(key => {
      resetValues[key] = 0;
    });
    onChange(resetValues);
  };

  // Calculate total calories
  const calculateTotalCalories = () => {
    // Standard calorie calculation
    const proteinCals = nutritionalInfo.protein * 4;
    const carbsCals = nutritionalInfo.carbs * 4;
    const fatCals = nutritionalInfo.fat * 9;
    
    handleBulkUpdate({
      calories: Math.round(proteinCals + carbsCals + fatCals)
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-primary-800">
          Nutritional Information
        </h2>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={calculateTotalCalories}
            className="text-sm text-primary-600 hover:text-primary-700 
              font-medium transition-colors duration-200"
          >
            Calculate Calories
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700 
              font-medium transition-colors duration-200"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Nutritional Summary */}
      <NutritionalSummary nutritionalInfo={nutritionalInfo} />

      {/* Input Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {NUTRITIONAL_FIELDS.map(({ id, label, unit, step, icon }) => (
          <NutritionalInput
            key={id}
            id={id}
            label={label}
            value={nutritionalInfo[id]}
            onChange={handleChange}
            unit={unit}
            step={step}
            icon={icon}
          />
        ))}
      </div>

      {/* Info Box */}
      <InfoBox>
        Providing accurate nutritional information helps users with specific 
        dietary needs find your recipe. Values should be per serving. Use the 
        "Calculate Calories" button to automatically calculate total calories 
        based on macronutrients.
      </InfoBox>
    </div>
  );
};

export default NutritionalInfoForm;