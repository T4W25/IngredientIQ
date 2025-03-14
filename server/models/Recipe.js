// server/models/Recipe.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  ingredients: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
  }],
  steps: [{ type: String }],
  prepTime: { type: Number }, // in minutes
  servings: { type: Number },
  difficultyLevel: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  images: [{ type: String }], // URLs or file paths
  videos: [{ type: String }], // URLs or file paths
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dietaryTags: [{ type: String }],
}, {
  timestamps: true  // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Recipe', recipeSchema);
