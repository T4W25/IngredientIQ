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

// Review management routes
router.post('/recipe/:recipeId', auth, validateRecipeId, ReviewController.addReview);
router.put('/recipe/:recipeId', auth, validateRecipeId, isReviewOwner, ReviewController.updateReview);
router.delete('/recipe/:recipeId', auth, validateRecipeId, isReviewOwner, ReviewController.deleteReview);

// Get reviews
router.get('/recipe/:recipeId', validateRecipeId, ReviewController.getRecipeReviews);
router.get('/author/reviews', auth, ReviewController.getAuthorRecipeReviews);

module.exports = router;