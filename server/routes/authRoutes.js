const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const userController = require('../controllers/userController');
const authorProfileController = require('../controllers/authorProfileController');
const userProfileController = require('../controllers/userProfileController');
const auth = require('../middleware/authMiddleware');


router.post('/register/user', userController.registerUser);
router.post('/register/author', authorController.registerAuthor);
router.post('/signin/user', userController.signInUser);
router.post('/signin/author', authorController.signInAuthor);
router.post('/signout/user', userController.signOutUser);
router.post('/signout/author', authorController.signOutAuthor);
router.patch('/profile/user', auth, userProfileController.updateUserProfile);
//router.get('/profile/user', userProfileController.getUserProfile);
router.patch('/profile/author', auth, authorProfileController.updateAuthorProfile);

module.exports = router;