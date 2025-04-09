// server/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

// Review management
router.post('/recipe/:recipeId', auth,ReviewController.addReview);
router.put('/recipe/:recipeId', auth, ReviewController.updateReview);
router.delete('/recipe/:recipeId', auth, ReviewController.deleteReview);

// Get reviews
router.get('/recipe/:recipeId', ReviewController.getRecipeReviews);
router.get('/author/reviews', auth, ReviewController.getAuthorRecipeReviews);

module.exports = router;