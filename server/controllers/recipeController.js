const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');

// Helper function to validate Base64 images

// Get a single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate('authorId', 'name profileImage');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
};

// Get all recipes (with filters)
const getRecipes = async (req, res) => {
  try {
    const { search, category, cuisine, difficulty, dietary, status = 'published', page = 1, limit = 10 } = req.query;

    const query = { status };

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    if (cuisine) {
      query.cuisine = cuisine;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (dietary) {
      query[`dietaryRestrictions.${dietary}`] = true;
    }

    // Paginate results
    const skip = (page - 1) * limit;
    const recipes = await Recipe.find(query)
      .populate('authorId', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};

// Add a new recipe
const addRecipe = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized - author ID missing' });
    }

    const recipeData = {
      title: req.body.title,
      description: req.body.description,
      prepTime: Number(req.body.prepTime) || 0,
      cookTime: Number(req.body.cookTime) || 0,
      servings: Number(req.body.servings) || 1,
      difficulty: req.body.difficulty || 'easy',
      cuisine: req.body.cuisine,
      category: req.body.category || 'lunch',
      mainImage: req.body.mainImage || '',
      gallery: req.body.gallery || [],
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      nutritionalInfo: req.body.nutritionalInfo || {},
      dietaryRestrictions: req.body.dietaryRestrictions || {},
      authorId: new mongoose.Types.ObjectId(req.user._id),
      status: 'draft',
    };

    if (!recipeData.title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!Array.isArray(recipeData.ingredients) || recipeData.ingredients.length === 0) {
      return res.status(400).json({ error: 'At least one ingredient is required' });
    }

    if (!Array.isArray(recipeData.instructions) || recipeData.instructions.length === 0) {
      return res.status(400).json({ error: 'At least one instruction is required' });
    }

    const newRecipe = new Recipe(recipeData);

    const validationError = newRecipe.validateSync();
    if (validationError) {
      return res.status(400).json({
        error: 'Validation Error',
        details: Object.values(validationError.errors).map(err => err.message),
      });
    }

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ error: 'Failed to add recipe', details: error.message });
  }
};

// Update recipe
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.recipeId, authorId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('authorId', 'username email');

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found or not authorized' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update recipe', details: error.message });
  }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.recipeId);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ error: 'Failed to delete recipe', details: error.message });
  }
};

// Publish recipe
const publishRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { status: 'published' },
      { new: true }
    );
    res.json({ message: 'Recipe published', recipe });
  } catch (err) {
    res.status(500).json({ error: 'Failed to publish recipe' });
  }
};

// Get all published recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .populate('authorId', 'username profilePicture');

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all recipes' });
  }
};

// Get draft recipes (for moderation queue)
const getDraftRecipes = async (req, res) => {
  try {
    const drafts = await Recipe.find({ status: 'draft' })
      .populate('authorId', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json(drafts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch draft recipes' });
  }
};

// Get recipes for the logged-in author
const getAuthorRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ authorId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('ratings.userId', 'username');

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve author recipes' });
  }
};

module.exports = { 
  getRecipeById, 
  getAllRecipes, 
  addRecipe, 
  updateRecipe, 
  deleteRecipe, 
  publishRecipe, 
  getDraftRecipes, 
  getAuthorRecipes 
};
