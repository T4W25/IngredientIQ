// server/models/Recipe.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nutritionalInfoSchema = new Schema({
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 }
});

const dietaryRestrictionsSchema = new Schema({
  isVegetarian: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  isDairyFree: { type: Boolean, default: false },
  isNutFree: { type: Boolean, default: false },
  isKeto: { type: Boolean, default: false },
  isPaleo: { type: Boolean, default: false },
  isLowCarb: { type: Boolean, default: false },
  suitableForChildren: { type: Boolean, default: false }
});

const recipeSchema = new Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true
  },
  description: { 
    type: String, 
    default: '',
    trim: true
  },
  prepTime: { 
    type: Number,
    default: 0,
    min: [0, 'Preparation time cannot be negative']
  },
  cookTime: { 
    type: Number,
    default: 0,
    min: [0, 'Cooking time cannot be negative']
  },
  servings: { 
    type: Number,
    default: 1,
    min: [1, 'Servings must be at least 1']
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  cuisine: { 
    type: String,
    trim: true
  },
  category: { 
    type: String,
    enum: [
      'breakfast', 
      'lunch', 
      'dinner', 
      'appetizer', 
      'dessert', 
      'snack'
    ],
    default: 'lunch',
    trim: true
  },
  mainImage: { 
    type: String,  // URL or file path
    required: [true, 'Main image is required']
  },
  gallery: [{ 
    type: String  // URLs or file paths
  }],
  ingredients: [{
    name: { 
      type: String, 
      required: [true, 'Ingredient name is required'],
      trim: true
    },
    quantity: { 
      type: String,
      required: [true, 'Quantity is required'],
      trim: true
    },
    unit: { 
      type: String,
      required: [true, 'Unit is required'],
      trim: true
    }
  }],
  instructions: [{
    step: { 
      type: Number,
      required: true,
      min: [1, 'Step number must be positive']
    },
    text: { 
      type: String,
      required: [true, 'Instruction text is required'],
      trim: true
    },
    image: { 
      type: String,  // URL or file path
      default: ''
    }
  }],
  nutritionalInfo: {
    type: nutritionalInfoSchema,
    default: () => ({})
  },
  dietaryRestrictions: {
    type: dietaryRestrictionsSchema,
    default: () => ({})
  },
  authorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'user', 
    required: [true, 'Author ID is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, default: '' }
  }],
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total time
recipeSchema.virtual('totalTime').get(function() {
  return this.prepTime + this.cookTime;
});

// Index for better search performance

recipeSchema.index({ title: 'text', description: 'text', 'ingredients.name': 'text' });
recipeSchema.index({ 'ingredients.name': 1 }); // Regular index for non-text searches

// Pre-save middleware to update average rating
recipeSchema.pre('save', function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const totalRating = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = totalRating / this.ratings.length;
    this.totalRatings = this.ratings.length;
  }
  next();
});

module.exports = mongoose.model('Recipe', recipeSchema);