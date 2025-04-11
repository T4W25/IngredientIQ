const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const userController = require('../controllers/userController');
const authorProfileController = require('../controllers/authorProfileController');
const userProfileController = require('../controllers/userProfileController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer setup for file uploading
const upload = multer({ 
  dest: 'uploads/',  // Directory for storing uploaded files
  limits: { fileSize: 50 * 1024 * 1024 },  // Max file size: 50MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

// Image upload route
router.post('/profile/user/upload-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Log the file for debugging
    console.log('Uploaded file:', req.file);

    // Create the URL for the image
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);  // More detailed error logging
    res.status(500).json({ error: 'Something broke!' });
  }
});

// Other routes related to user and author
router.post('/register/user', userController.registerUser);
router.post('/register/author', authorController.registerAuthor);
router.post('/signin/user', userController.signInUser);
router.post('/signin/author', authorController.signInAuthor);
router.post('/signout/user', userController.signOutUser);
router.post('/signout/author', authorController.signOutAuthor);

// Profile related routes
router.patch('/profile/user', auth, userProfileController.updateUserProfile);
router.get('/profile/user', auth, userProfileController.getUserProfile);
router.get('/profile/author', auth, authorProfileController.getAuthorProfile);
router.patch('/profile/author', auth, authorProfileController.updateAuthorProfile);

module.exports = router;
