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
exports.addRecipe = async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      authorId: req.user._id,
      status: req.body.status || 'draft'
    };

    // Validate base64 images
    if (
      recipeData.mainImage &&
      !recipeData.mainImage.startsWith('data:image/')
    ) {
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
