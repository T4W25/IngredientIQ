const MealPlan = require('../models/MealPlan');
const { validationResult } = require('express-validator');

// Create meal plan
const createMealPlan = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ error: 'Unauthorized - user ID missing' });
  }  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { planType, startDate, endDate, recipes } = req.body;
    const userId = req.user._id;

    // You may want to validate the received fields here
    if (!planType || !startDate || !endDate || !recipes || recipes.length === 0) {
      return res.status(400).json({ error: 'Missing required fields or empty recipes list' });
    }

    const mealPlan = new MealPlan({
      userId,
      planType,
      startDate,
      endDate,
      recipes
    });

    await mealPlan.save();
    res.status(201).json(mealPlan);
  } catch (error) {
    console.error("Error creating meal plan:", error);
    res.status(500).json({ message: 'Failed to create meal plan' });
  }
};

// Get grocery list
const getGroceryList = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized - user ID missing' });
    }
    const mealPlan = await MealPlan.findOne({ _id: req.params.id, userId: req.user.id }).populate('recipes.recipeId');
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    const groceryList = {};

    mealPlan.recipes.forEach(({ recipeId, servings }) => {
      recipeId.ingredients.forEach(({ name, quantity, unit }) => {
        const totalQuantity = (quantity / recipeId.servings) * servings;
        if (groceryList[name]) {
          groceryList[name].quantity += totalQuantity;
        } else {
          groceryList[name] = { quantity: totalQuantity, unit };
        }
      });
    });

    const formattedGroceryList = Object.entries(groceryList).map(([name, { quantity, unit }]) => ({
      ingredient: name,
      quantity,
      unit
    }));

    res.json({ groceryList: formattedGroceryList });
  } catch (error) {
    console.error("Error fetching grocery list:", error);
    res.status(500).json({ message: 'Failed to retrieve grocery list' });
  }
};

// Get meal plans
const getMealPlans = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized - user ID missing' });
    }

    const plans = await MealPlan.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('recipes.recipeId');

    const enrichedPlans = plans.map(plan => ({
      ...plan._doc,
      recipes: plan.recipes.map(r => ({
        day: r.day,
        meal: r.meal,
        servings: r.servings,
        recipe: r.recipeId // populated full recipe
      }))
    }));

    res.status(200).json(enrichedPlans);
  } catch (err) {
    console.error("Error fetching meal plans:", err);
    res.status(500).json({ error: 'Failed to fetch meal plans' });
  }
};

module.exports = {
  createMealPlan,
  getGroceryList,
  getMealPlans
};
