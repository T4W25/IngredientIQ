// server/controllers/recipeController.js
const Recipe = require('../models/Recipe');

exports.getRecipes = async (req, res) => {
  try {
    const {
      search,
      category,
      cuisine,
      difficulty,
      dietary,
      status = 'published'
    } = req.query;

    // Build query
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

    const recipes = await Recipe.find(query)
      .populate('authorId', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json(recipes);

  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ 
      message: 'Error fetching recipes',
      error: error.message 
    });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate('authorId', 'name profileImage');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ 
      message: 'Error fetching recipe',
      error: error.message 
    });
  }
};
// server/controllers/recipeController.js
/// RecipeController.js
exports.addRecipe = async (req, res) => {
  try {
    // Log the incoming request
    console.log('Request body:', req.body);
    console.log('Request user:', req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized - author ID missing' });
    }

    // Log the data being processed
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
      authorId: req.user._id,
      status: 'draft'
    };

    console.log('Processed recipe data:', recipeData);

    // Validate the data
    if (!recipeData.title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!Array.isArray(recipeData.ingredients) || recipeData.ingredients.length === 0) {
      return res.status(400).json({ error: 'At least one ingredient is required' });
    }

    if (!Array.isArray(recipeData.instructions) || recipeData.instructions.length === 0) {
      return res.status(400).json({ error: 'At least one instruction is required' });
    }

    // Create new recipe
    const newRecipe = new Recipe(recipeData);

    // Log the mongoose document before saving
    console.log('Mongoose document before save:', newRecipe);

    // Validate the document
    const validationError = newRecipe.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      return res.status(400).json({ 
        error: 'Validation Error',
        details: Object.values(validationError.errors).map(err => err.message)
      });
    }

    // Save the recipe
    const savedRecipe = await newRecipe.save();
    console.log('Recipe saved successfully:', savedRecipe._id);

    res.status(201).json(savedRecipe);
  } catch (error) {
    // Detailed error logging
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      errors: error.errors // Mongoose validation errors
    });

    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation Error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    // Send detailed error response
    res.status(500).json({ 
      error: 'Failed to add recipe',
      details: error.message,
      type: error.name
    });
  }
};

// Add a helper function to validate Base64 images
const isValidBase64Image = (base64String) => {
  try {
    return base64String.startsWith('data:image/') && base64String.includes(';base64,');
  } catch {
    return false;
  }
};

exports.getAuthorRecipes = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { authorId: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const recipes = await Recipe.find(query)
      .sort('-createdAt')
      .populate('ratings.userId', 'username');
      
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recipes' });
  }
};

exports.updateRecipe = async (req, res) => {
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
    res.status(500).json({ 
      error: 'Failed to update recipe',
      details: error.message 
    });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.recipeId);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ 
      error: 'Failed to delete recipe',
      details: error.message 
    });
  }
};

exports.getDraftRecipes = async (req, res) => {
  try {
    const drafts = await Recipe.find({ status: 'draft' })
    res.status(200).json(drafts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drafts' });
  }
};

exports.publishRecipe = async (req, res) => {
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

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .populate('authorId', 'username profilePicture');

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all recipes' });
  }
};

