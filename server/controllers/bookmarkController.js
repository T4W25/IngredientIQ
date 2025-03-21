// server/controllers/BookmarkController.js
const Bookmark = require('../models/Bookmark');

// Create a new bookmark
exports.createBookmark = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    const newBookmark = new Bookmark({ userId, recipeId });
    await newBookmark.save();
    res.status(201).json(newBookmark);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
};

// Get all bookmarks for a user
exports.getUserBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookmarks = await Bookmark.find({ userId }).populate('recipeId');
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve bookmarks' });
  }
};

// Delete a bookmark
exports.deleteBookmark = async (req, res) => {
  try {
    const { bookmarkId } = req.params;
    await Bookmark.findByIdAndDelete(bookmarkId);
    res.status(200).json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
};