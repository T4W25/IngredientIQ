const Review = require('../models/Review');
const Recipe = require('../models/Recipe');

// Add or update a review
exports.addReview = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized - user ID missing' });
    }
    const { recipeId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
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

    // Recalculate average rating for the recipe
    await Review.calculateAverageRating(recipeId);

    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding or updating review:', error);
    res.status(500).json({ 
      error: 'Failed to add review',
      details: error.message 
    });
  }
};

// Get all reviews for a recipe
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
    console.error('Error fetching recipe reviews:', error);
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
};

// Get all reviews for recipes by the logged-in author
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
    console.error('Error fetching author recipe reviews:', error);
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
};

// Update an existing review
exports.updateReview = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized - user ID missing' });
    }
    const { rating, comment } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = await Review.findOneAndUpdate(
      { 
        recipeId: req.params.recipeId,
        userId: req.user._id
      },
      { rating, comment },
      { new: true, runValidators: true }
    ).populate('userId', 'username');

    if (!review) {
      return res.status(404).json({ error: 'Review not found or not authorized' });
    }

    // Recalculate average rating for the recipe
    await Review.calculateAverageRating(req.params.recipeId);

    res.status(200).json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized - user ID missing' });
    }

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
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
