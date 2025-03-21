// server/controllers/RecipeController.js
const Recipe = require('../models/Recipe');

// Retrieve a recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findById(recipeId).populate('authorId', 'username email');
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recipe' });
  }
};

// Retrieve all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('authorId', 'username email');
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recipes' });
  }
};



// Add a new recipe
exports.addRecipe = async (req, res) => {
  try {
    const recipeData = { ...req.body, authorId: req.user._id };
    const newRecipe = new Recipe(recipeData);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add recipe' });
  }
};

// Retrieve all recipes by the author
exports.getAuthorRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ authorId: req.user._id });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recipes' });
  }
};

// Delete a recipe by ID
exports.deleteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findOneAndDelete({ _id: recipeId, authorId: req.user._id });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found or not authorized' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};
