const express = require('express');
const { body } = require('express-validator');
const { createMealPlan, getGroceryList, getMealPlans } = require('../controllers/mealPlanController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Custom validator for startDate and endDate
const validateDateRange = (value, { req }) => {
  if (new Date(value) <= new Date(req.body.startDate)) {
    throw new Error('endDate must be later than startDate');
  }
  return true;
};

router.post('/', auth, [
  body('planType').isIn(['Weekly', 'Bi-Weekly']),
  body('startDate').isISO8601(),
  body('endDate').isISO8601().custom(validateDateRange), // Custom validation for date range
  body('recipes').isArray().notEmpty().withMessage('Recipes cannot be empty')
    .bail().custom((recipes) => {
      // Validate that each recipe has required fields
      recipes.forEach(recipe => {
        if (!recipe.recipeId || !recipe.servings || !recipe.day || !recipe.meal) {
          throw new Error('Each recipe must have recipeId, servings, day, and meal');
        }
      });
      return true;
    })
], createMealPlan);

router.get('/:id/grocery-list', auth, getGroceryList);
router.get('/', auth, getMealPlans);

module.exports = router;