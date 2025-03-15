const Recipe = require('../models/Recipe');

// Search recipes with optional filters for prepTime and difficultyLevel
exports.searchRecipes = async (req, res) => {
  try {
    const { query, prepTime, difficultyLevel } = req.query;

    // Build the search criteria
    let searchCriteria = {};

    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'ingredients.name': { $regex: query, $options: 'i' } }
      ];
    }

    if (prepTime) {
      searchCriteria.prepTime = { $lte: parseInt(prepTime, 10) };
    }

    if (difficultyLevel) {
      searchCriteria.difficultyLevel = difficultyLevel;
    }

    const recipes = await Recipe.find(searchCriteria);

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};