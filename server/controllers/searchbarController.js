const Recipe = require('../models/Recipe');
  
exports.searchRecipes = async (req, res) => {
  try {
    const {
      query,
      ingredients,
      prepTime,
      cookTime,
      difficulty,
      cuisine,
      category,
      dietary
    } = req.query;

    let searchCriteria = { status: 'published' };

    // Text search in title, description, and ingredients
    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Ingredient search
    if (ingredients) {
      const ingredientArray = ingredients.split(',').map(i => i.trim());
      searchCriteria['ingredients.name'] = {
        $all: ingredientArray.map(ing => new RegExp(ing, 'i'))
      };
    }

    // Time filters
    if (prepTime) searchCriteria.prepTime = { $lte: parseInt(prepTime) };
    if (cookTime) searchCriteria.cookTime = { $lte: parseInt(cookTime) };

    // Other filters
    if (difficulty) searchCriteria.difficulty = difficulty;
    if (cuisine) searchCriteria.cuisine = cuisine;
    if (category) searchCriteria.category = category;

    // Dietary restrictions
    if (dietary) {
      const dietaryArray = dietary.split(',');
      dietaryArray.forEach(restriction => {
        searchCriteria[`dietaryRestrictions.${restriction}`] = true;
      });
    }

    const recipes = await Recipe.find(searchCriteria)
      .populate('authorId', 'username email')
      .sort('-averageRating -createdAt');

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
