// routes/mealPlanRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { createMealPlan, getGroceryList } = require('../controllers/mealPlanController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/',auth,[
    body('planType').isIn(['Weekly', 'Bi-Weekly']),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('recipes').isArray().notEmpty()
  ],
  createMealPlan
);

router.get('/:id/grocery-list', auth, getGroceryList);

module.exports = router;