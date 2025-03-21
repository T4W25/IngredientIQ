// server/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/recipeController');
const auth = require('../middleware/authMiddleware');

// Route to get a recipe by ID and all recipes
router.get('/:recipeId', RecipeController.getRecipeById);
router.get('/', RecipeController.getAllRecipes);

// Route to add a new recipe
router.post('/add', auth, RecipeController.addRecipe);

// Route to get all recipes by the author
router.get('/my-recipes', auth, RecipeController.getAuthorRecipes);

// Route to delete a recipe by ID
router.delete('/:recipeId', auth, RecipeController.deleteRecipe);

module.exports = router;