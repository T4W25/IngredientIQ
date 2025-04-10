// server/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/recipeController');
const auth = require('../middleware/authMiddleware');

// Recipe retrieval
router.get('/moderation-queue', RecipeController.getDraftRecipes);
router.get('/:recipeId', RecipeController.getRecipeById);
router.get('/', RecipeController.getAllRecipes);

// Recipe management
router.post('/add', auth, RecipeController.addRecipe);
router.put('/:recipeId', auth, RecipeController.updateRecipe);
router.delete('/:recipeId', auth, RecipeController.deleteRecipe);
router.patch('/:id/publish', RecipeController.publishRecipe);

// Author-specific routes
router.get('/author/my-recipes', auth,  RecipeController.getAuthorRecipes);

module.exports = router;