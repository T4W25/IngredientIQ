const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  recipeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Recipe', 
    required: true 
  },
}, {
  timestamps: { createdAt: true, updatedAt: false }  // Only createdAt
});

// Ensuring that each user can only bookmark a recipe once
bookmarkSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

// Optional: If you'd like to add more validation or logic before saving
// bookmarkSchema.pre('save', async function(next) {
//   const user = await mongoose.model('User').findById(this.userId);
//   const recipe = await mongoose.model('Recipe').findById(this.recipeId);

//   if (!user || !recipe) {
//     throw new Error('User or Recipe not found');
//   }

//   next();
// });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
