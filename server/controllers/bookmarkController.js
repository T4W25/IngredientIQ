// server/controllers/BookmarkController.js
const Bookmark = require('../models/Bookmark');
const mongoose = require('mongoose');

// server/controllers/bookmarkController.js

exports.addBookmark = async (req, res) => {
  try {
    // Get userId from either the token or request body
    const userId = req.user?.id || req.body.userId;
    const { recipeId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!recipeId) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({ userId, recipeId });
    if (existingBookmark) {
      return res.status(400).json({ error: 'Recipe already bookmarked' });
    }

    const newBookmark = new Bookmark({
      userId,
      recipeId
    });

    await newBookmark.save();
    
    res.status(201).json({
      bookmarkId: newBookmark._id,
      message: 'Bookmark added successfully'
    });
  } catch (error) {
    console.error('Bookmark creation error:', error);
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
};

// Get bookmarks for a user
// server/controllers/bookmarkController.js

exports.getUserBookmarks = async (req, res) => {
  try {
    console.log('Getting bookmarks for user:', req.user); // Debug log

    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Find bookmarks with populated recipe data
    const bookmarks = await Bookmark.find({ userId })
      .populate({
        path: 'recipeId',
        select: 'title mainImage totalTime difficulty servings'
      })
      .lean() // Convert to plain JavaScript objects
      .exec();

    console.log('Found bookmarks:', bookmarks); // Debug log

    // Filter out null recipes and format response
    const validBookmarks = bookmarks
      .filter(bookmark => bookmark.recipeId)
      .map(bookmark => ({
        _id: bookmark._id,
        recipeId: bookmark.recipeId,
        createdAt: bookmark.createdAt
      }));

    res.status(200).json(validBookmarks);

  } catch (error) {
    console.error('Error in getUserBookmarks:', error);
    res.status(500).json({
      error: 'Failed to retrieve bookmarks',
      details: error.message
    });
  }
};
// Delete a bookmark
// server/controllers/bookmarkController.js

exports.deleteBookmark = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { bookmarkId } = req.params;

    console.log('Attempting to delete bookmark:', { userId, bookmarkId }); // Debug log

    if (!bookmarkId) {
      return res.status(400).json({ error: 'Bookmark ID is required' });
    }

    // Find and delete the bookmark
    const deletedBookmark = await Bookmark.findOneAndDelete({
      _id: bookmarkId,
      userId: userId
    });

    if (!deletedBookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    res.status(200).json({ 
      message: 'Bookmark deleted successfully',
      deletedBookmark 
    });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    res.status(500).json({ 
      error: 'Failed to delete bookmark',
      details: error.message 
    });
  }
};

// Check if recipe is bookmarked
// server/controllers/bookmarkController.js

exports.checkBookmarkStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { recipeId } = req.params;

    console.log('Checking bookmark status:', { userId, recipeId }); // Debug log

    if (!userId || !recipeId) {
      return res.status(400).json({ 
        error: 'Both User ID and Recipe ID are required' 
      });
    }

    const bookmark = await Bookmark.findOne({ 
      userId: userId,
      recipeId: recipeId 
    });

    res.status(200).json({
      isBookmarked: !!bookmark,
      bookmarkId: bookmark ? bookmark._id : null
    });
  } catch (error) {
    console.error('Check bookmark status error:', error);
    res.status(500).json({ error: 'Failed to check bookmark status' });
  }
};