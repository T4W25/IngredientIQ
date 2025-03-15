const express = require('express');
const router = express.Router();
const searchbarController = require('../controllers/searchbarController');

// Search recipes
router.get('/recipes/search', searchbarController.searchRecipes);

module.exports = router;