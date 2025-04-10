// server/controllers/recipeController.js
const Recipe = require('../models/Recipe');

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate('authorId', 'username email')
      .populate('ratings.userId', 'username');
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recipe' });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: 'published' })
      .populate('authorId', 'username email')
      .sort('-createdAt');
    
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recipes' });
  }
};

// server/controllers/recipeController.js
exports.addRecipe = async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      authorId: req.user._id,
      status: req.body.status || 'draft'
    };

    // Validate base64 images
    if (!recipeData.mainImage.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid main image format' });
    }

    if (recipeData.gallery) {
      for (let image of recipeData.gallery) {
        if (!image.startsWith('data:image/')) {
          return res.status(400).json({ error: 'Invalid gallery image format' });
        }
      }
    }

    const newRecipe = new Recipe(recipeData);
    await newRecipe.save();
    
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).json({ 
      error: 'Failed to add recipe',
      details: error.message 
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
    const recipe = await Recipe.findOneAndDelete({
      _id: req.params.recipeId,
      authorId: req.user._id
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found or not authorized' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};
