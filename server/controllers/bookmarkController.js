const Bookmark = require('../models/Bookmark');
const mongoose = require('mongoose');

// Add bookmark
exports.addBookmark = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { recipeId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!recipeId) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }

    const existingBookmark = await Bookmark.findOne({ userId, recipeId });
    if (existingBookmark) {
      return res.status(400).json({ error: 'Recipe already bookmarked' });
    }

    const newBookmark = new Bookmark({ userId, recipeId });
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
exports.getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const bookmarks = await Bookmark.find({ userId })
      .populate({
        path: 'recipeId',
        select: 'title mainImage totalTime difficulty servings'
      })
      .lean()
      .exec();

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
exports.deleteBookmark = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { bookmarkId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!bookmarkId) {
      return res.status(400).json({ error: 'Bookmark ID is required' });
    }

    const deletedBookmark = await Bookmark.findOneAndDelete({
      _id: bookmarkId,
      userId
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
exports.checkBookmarkStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { recipeId } = req.params;

    if (!userId || !recipeId) {
      return res.status(400).json({
        error: 'Both User ID and Recipe ID are required'
      });
    }

    const bookmark = await Bookmark.findOne({
      userId,
      recipeId
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
