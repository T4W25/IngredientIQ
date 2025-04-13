const express = require('express');
const router = express.Router();
const moderatorController = require('../controllers/moderatorController');
const { body, param } = require('express-validator');

// Validate authorId parameter to be a valid ObjectId
const validateAuthorId = param('authorId').isMongoId().withMessage('Invalid author ID format');

// Get all pending verification requests
router.get('/pending-verifications', moderatorController.getPendingVerifications);

// Approve verification request
router.patch('/approve/:authorId', validateAuthorId, moderatorController.approveAuthor);

// Reject verification request
router.patch('/reject/:authorId', validateAuthorId, moderatorController.rejectAuthor);

module.exports = router;