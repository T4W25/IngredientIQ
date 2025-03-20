// server/controllers/ReviewController.js
const Review = require('../models/Review');
const Recipe = require('../models/Recipe');

// Add a review to a recipe
exports.addReview = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const newReview = new Review({ recipeId, userId, rating, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
};

// Get all reviews for a specific recipe
exports.getRecipeReviews = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const reviews = await Review.find({ recipeId }).populate('userId', 'username');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
};

// Get all reviews for recipes uploaded by the author
exports.getAuthorRecipeReviews = async (req, res) => {
  try {
    const recipes = await Recipe.find({ authorId: req.user._id });
    const recipeIds = recipes.map(recipe => recipe._id);
    const reviews = await Review.find({ recipeId: { $in: recipeIds } }).populate('userId', 'username');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
};