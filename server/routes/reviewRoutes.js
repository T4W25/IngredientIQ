// server/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

// Route to add a review to a recipe
router.post('/:recipeId', auth, ReviewController.addReview);

// Route to get all reviews for a specific recipe
router.get('/:recipeId', ReviewController.getRecipeReviews);

// Route to get all reviews for recipes uploaded by the author
router.get('/author/my-reviews', auth, ReviewController.getAuthorRecipeReviews);

module.exports = router;