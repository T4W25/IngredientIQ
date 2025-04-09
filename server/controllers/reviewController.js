// server/controllers/reviewController.js
const Review = require('../models/Review');
const Recipe = require('../models/Recipe');

exports.addReview = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if user has already reviewed
    let review = await Review.findOne({ recipeId, userId });

    if (review) {
      // Update existing review
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      // Create new review
      review = new Review({ recipeId, userId, rating, comment });
      await review.save();
    }

    // Populate user information
    await review.populate('userId', 'username');

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to add review',
      details: error.message 
    });
  }
};

exports.getRecipeReviews = async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    const reviews = await Review.find({ recipeId })
      .populate('userId', 'username')
      .sort('-createdAt');

    const recipe = await Recipe.findById(recipeId);
    
    res.status(200).json({
      reviews,
      averageRating: recipe.averageRating,
      totalReviews: recipe.totalRatings
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
};

exports.getAuthorRecipeReviews = async (req, res) => {
  try {
    const recipes = await Recipe.find({ authorId: req.user._id });
    const recipeIds = recipes.map(recipe => recipe._id);
    
    const reviews = await Review.find({ recipeId: { $in: recipeIds } })
      .populate('userId', 'username')
      .populate('recipeId', 'title')
      .sort('-createdAt');

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findOneAndUpdate(
      { 
        recipeId: req.params.recipeId,
        userId: req.user._id
      },
      { rating, comment },
      { new: true, runValidators: true }
    ).populate('userId', 'username');

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      recipeId: req.params.recipeId,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Recalculate average rating
    await Review.calculateAverageRating(req.params.recipeId);

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};