const express = require('express');
const router = express.Router();
const moderatorController = require('../controllers/moderatorController');
const auth = require('../middleware/authMiddleware');
const { body, param } = require('express-validator');

// Middleware for moderator role check
const isModerator = (req, res, next) => {
  if (req.user.role !== 'Moderator') {
    return res.status(403).json({ message: 'Access denied: Moderator role required' });
  }
  next();
};

// Apply auth and role middleware to all moderator routes
router.use(auth, isModerator);

// Validate authorId parameter to be a valid ObjectId
const validateAuthorId = param('authorId').isMongoId().withMessage('Invalid author ID format');

router.get('/pending-verifications', moderatorController.getPendingVerifications);

router.patch('/approve/:authorId', validateAuthorId, moderatorController.approveAuthor);

router.patch('/reject/:authorId', validateAuthorId, moderatorController.rejectAuthor);

module.exports = router;