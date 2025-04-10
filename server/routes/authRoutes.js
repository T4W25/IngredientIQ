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
const upload = multer({ dest: 'uploads/' });

router.post('/profile/user/upload-image', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

router.post('/register/user', userController.registerUser);
router.post('/register/author', authorController.registerAuthor);
router.post('/signin/user', userController.signInUser);
router.post('/signin/author', authorController.signInAuthor);
router.post('/signout/user', userController.signOutUser);
router.post('/signout/author', authorController.signOutAuthor);
router.patch('/profile/user', auth, userProfileController.updateUserProfile);
router.get('/profile/user', auth, userProfileController.getUserProfile);
router.get('/profile/author', auth, authorProfileController.getAuthorProfile);
router.patch('/profile/author', auth, authorProfileController.updateAuthorProfile);

module.exports = router;

