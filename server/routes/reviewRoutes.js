const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');
const { param } = require('express-validator');
const Review = require('../models/Review'); // needed for isReviewOwner

// Middleware to validate recipeId parameter as a valid ObjectId
const validateRecipeId = param('recipeId').isMongoId().withMessage('Invalid recipe ID format');

// Middleware to check if the logged-in user is the author of the review
const isReviewOwner = async (req, res, next) => {
  const { recipeId } = req.params;
  const userId = req.user._id; // Assuming `req.user._id` contains the logged-in user's ID

  try {
    const review = await Review.findOne({ recipeId, userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found or you do not have permission to modify it' });
    }
    next();
  } catch (err) {
    console.error('Error checking review owner:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reviews for a recipe
router.get('/recipe/:recipeId', validateRecipeId, ReviewController.getRecipeReviews);

// Get all reviews for recipes by the logged-in author
router.get('/author/reviews', auth, ReviewController.getAuthorRecipeReviews);

// Add a review to a recipe
router.post('/recipe/:recipeId', auth, validateRecipeId, ReviewController.addReview);

// Update a review
router.put('/:reviewId', auth, ReviewController.updateReview);

// Delete a review
router.delete('/:reviewId', auth, ReviewController.deleteReview);

module.exports = router;