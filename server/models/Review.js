// server/models/Review.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
}, {
  timestamps: true
});

// Add index for better query performance
reviewSchema.index({ recipeId: 1, userId: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(recipeId) {
  const result = await this.aggregate([
    {
      $match: { recipeId: new mongoose.Types.ObjectId(recipeId) }
    },
    {
      $group: {
        _id: '$recipeId',
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 }
      }
    }
  ]);

  try {
    await Recipe.findByIdAndUpdate(recipeId, {
      averageRating: result[0]?.averageRating || 0,
      totalRatings: result[0]?.totalRatings || 0
    });
  } catch (error) {
    console.error('Error updating recipe rating:', error);
  }
};

// Middleware to calculate average rating after save
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.recipeId);
});

// Middleware to calculate average rating after delete
reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.recipeId);
});

module.exports = mongoose.model('Review', reviewSchema);