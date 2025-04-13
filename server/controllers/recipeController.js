const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');
const path = require('path');

// Helper function to transform image URLs
const transformImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return url.startsWith('/uploads/') ? url : `/uploads/${url}`;
};

// Helper function to validate Base64 images

// Get a single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate('authorId', 'name profileImage');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Transform image URLs
    recipe.mainImage = transformImageUrl(recipe.mainImage);
    recipe.gallery = recipe.gallery.map(img => transformImageUrl(img));
    recipe.instructions = recipe.instructions.map(inst => ({
      ...inst,
      image: transformImageUrl(inst.image)
    }));

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

    // Transform image URLs for all recipes
    const transformedRecipes = recipes.map(recipe => ({
      ...recipe.toObject(),
      mainImage: transformImageUrl(recipe.mainImage),
      gallery: recipe.gallery.map(img => transformImageUrl(img)),
      instructions: recipe.instructions.map(inst => ({
        ...inst,
        image: transformImageUrl(inst.image)
      }))
    }));

    res.json(transformedRecipes);
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

    // Handle mainImage URL
    if (recipeData.mainImage) {
      // If it's a full URL, extract just the path
      if (recipeData.mainImage.startsWith('http')) {
        const url = new URL(recipeData.mainImage);
        recipeData.mainImage = url.pathname;
      }
      // Ensure it starts with /uploads/
      if (!recipeData.mainImage.startsWith('/uploads/')) {
        recipeData.mainImage = '/uploads/' + recipeData.mainImage.replace(/^\/+/, '');
      }
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
// Update recipe
const updateRecipe = async (req, res) => {
  try {
    // Ensure authorId is set to the logged-in user (from JWT)
    req.body.authorId = req.user._id;

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
    console.error('Update recipe error:', error); // Log full error for debugging
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
    const { recipeId } = req.params;

    if (!recipeId) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ error: 'Invalid Recipe ID' });
    }

    const recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { status: 'published' },
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ message: 'Recipe published successfully', recipe });
  } catch (error) {
    console.error('Publish recipe error:', error);
    res.status(500).json({ 
      error: 'Failed to publish recipe',
      details: error.message 
    });
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
