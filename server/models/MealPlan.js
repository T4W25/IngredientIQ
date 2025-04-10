// server/models/MealPlan.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealPlanSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planType: { type: String, enum: ['Weekly', 'Bi-Weekly'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  recipes: [{
    recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
    servings: { type: Number, required: true },
    day: { type: String, required: true },      // ✅ Add this
    meal: { type: String, required: true }      // ✅ Add this
  }],  
  groceryList: [{
    ingredient: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
  }],
}, {
  timestamps: true  // createdAt and updatedAt
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
