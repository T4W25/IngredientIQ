// server/routes/bookmarkRoutes.js
const express = require('express');
const router = express.Router();
const BookmarkController = require('../controllers/bookmarkController');

// Route to create a new bookmark
router.post('/', BookmarkController.createBookmark);

// Route to get all bookmarks for a user
router.get('/:userId', BookmarkController.getUserBookmarks);

// Route to delete a bookmark
router.delete('/:bookmarkId', BookmarkController.deleteBookmark);

module.exports = router;

