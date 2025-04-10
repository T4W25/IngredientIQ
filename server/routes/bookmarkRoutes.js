// server/routes/bookmarkRoutes.js
const express = require('express');
const router = express.Router();
const BookmarkController = require('../controllers/bookmarkController');
const auth = require('../middleware/authMiddleware');

// Route to create a new bookmark
router.post('/', auth, BookmarkController.createBookmark);

// Route to get all bookmarks for the logged-in user
router.get('/', auth, BookmarkController.getUserBookmarks);

// Route to delete a bookmark
router.delete('/:bookmarkId', auth, BookmarkController.deleteBookmark);

module.exports = router;

