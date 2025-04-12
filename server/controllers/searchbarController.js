const Recipe = require('../models/Recipe');

exports.searchRecipes = async (req, res) => {
  try {
    const {
      search, // ✅ renamed from 'query'
      ingredients,
      prepTime,
      cookTime,
      difficulty,
      cuisine,
      category,
      dietary
    } = req.query;

    let searchCriteria = { status: 'published' };

    // ✅ Text search in title or description
    if (search) {
      searchCriteria.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // ✅ Ingredient filter
    if (ingredients) {
      const ingredientArray = ingredients.split(',').map(i => i.trim());
      if (ingredientArray.length > 0) {
        searchCriteria['ingredients.name'] = {
          $all: ingredientArray.map(ing => new RegExp(ing, 'i'))
        };
      }
    }

    // ✅ Time filters
    if (prepTime && !isNaN(prepTime)) {
      searchCriteria.prepTime = { $lte: parseInt(prepTime) };
    }
    if (cookTime && !isNaN(cookTime)) {
      searchCriteria.cookTime = { $lte: parseInt(cookTime) };
    }

    if (difficulty) searchCriteria.difficulty = difficulty;
    if (cuisine) searchCriteria.cuisine = cuisine;
    if (category) searchCriteria.category = category;

    // ✅ Dietary restrictions
    if (dietary) {
      const dietaryArray = dietary.split(',');
      dietaryArray.forEach(restriction => {
        searchCriteria[`dietaryRestrictions.${restriction.trim()}`] = true;
      });
    }

    const recipes = await Recipe.find(searchCriteria)
      .populate('authorId', 'username email')
      .sort('-averageRating -createdAt');

    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error in searchRecipes:', error);
    res.status(500).json({ error: error.message });
  }
};