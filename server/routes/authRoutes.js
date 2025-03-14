const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const userController = require('../controllers/userController');

router.post('/register/user', userController.registerUser);
router.post('/register/author', authorController.registerAuthor);
router.post('/signin/user', userController.signInUser);
router.post('/signin/author', authorController.signInAuthor);
router.post('/signout/user', userController.signOutUser);
router.post('/signout/author', authorController.signOutAuthor);

module.exports = router;