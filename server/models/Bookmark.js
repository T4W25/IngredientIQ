// server/models/Bookmark.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false }  // Only createdAt
});

bookmarkSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
