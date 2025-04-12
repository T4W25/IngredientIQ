const express = require('express');
const router = express.Router();
const searchbarController = require('../controllers/searchbarController');
const { query } = require('express-validator');

// Validate the search query for non-empty input
const validateSearchQuery = query('search')
  .trim()
  .notEmpty()
  .withMessage('Search query cannot be empty');

router.get('/recipes/search', validateSearchQuery, searchbarController.searchRecipes);

module.exports = router;