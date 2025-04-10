// server/routes/bookmarkRoutes.js
const express = require('express');
const router = express.Router();
const BookmarkController = require('../controllers/bookmarkController');
const auth = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(auth);

// Create a new bookmark
router.post('/', BookmarkController.addBookmark);

// Get all bookmarks for the logged-in user
router.get('/', BookmarkController.getUserBookmarks);

// Check if a recipe is bookmarked
router.get('/check/:recipeId', BookmarkController.checkBookmarkStatus);

// Delete a bookmark
router.delete('/:bookmarkId', BookmarkController.deleteBookmark);

module.exports = router;