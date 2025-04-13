const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/recipeController');
const auth = require('../middleware/authMiddleware');
const { param } = require('express-validator');
const Recipe = require('../models/Recipe');

// Middleware to validate recipeId parameter
const validateRecipeId = param('recipeId').isMongoId().withMessage('Invalid recipe ID format');

// Middleware to ensure the user is the author of the recipe
const isAuthorOrModerator = async (req, res, next) => {
    try {
      const recipe = await Recipe.findById(req.params.recipeId);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      if (recipe.authorId.toString() !== req.user.id && req.user.role !== 'Moderator') {
        return res.status(403).json({ message: 'You are not the author of this recipe' });
      }
  
      next();
    } catch (error) {
      console.error('Authorization middleware error:', error);
      res.status(500).json({ message: 'Server error while checking permissions' });
    }
  };

// Recipe retrieval routes
router.get('/moderation-queue', RecipeController.getDraftRecipes);
router.get('/:recipeId', validateRecipeId, RecipeController.getRecipeById);
router.get('/', RecipeController.getAllRecipes);

// Recipe management routes (author-only routes)
router.post('/add', auth, RecipeController.addRecipe);
router.put('/:recipeId', auth, validateRecipeId, isAuthorOrModerator, RecipeController.updateRecipe);
router.delete('/:recipeId', auth, validateRecipeId, isAuthorOrModerator, RecipeController.deleteRecipe);
router.patch('/:recipeId/publish', RecipeController.publishRecipe);

// Author-specific routes
router.get('/author/my-recipes', auth, RecipeController.getAuthorRecipes);

module.exports = router;