const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealPlanSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planType: { 
    type: String, 
    enum: ['Weekly', 'Bi-Weekly'], 
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  recipes: [{
    recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
    servings: { type: Number, required: true },
    day: { type: String, required: true },
    meal: { type: String, required: true }
  }],
  groceryList: [{
    ingredient: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
  }],
}, {
  timestamps: true  // createdAt and updatedAt
});

// Validate that startDate is earlier than endDate
mealPlanSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    return next(new Error('startDate must be earlier than endDate'));
  }

  // Validate if the planType duration matches the date range
  const durationInDays = (this.endDate - this.startDate) / (1000 * 3600 * 24);
  if (this.planType === 'Weekly' && durationInDays !== 7) {
    return next(new Error('Weekly plan must have a 7-day duration'));
  }
  if (this.planType === 'Bi-Weekly' && durationInDays !== 14) {
    return next(new Error('Bi-Weekly plan must have a 14-day duration'));
  }

  next();
});

// Add indexes for userId and startDate for performance optimization
mealPlanSchema.index({ userId: 1 });
mealPlanSchema.index({ startDate: 1 });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
