const express = require('express');
const router = express.Router();
const moderatorController = require('../controllers/moderatorController');

router.get('/pending-verifications', moderatorController.getPendingVerifications);
router.patch('/approve/:authorId', moderatorController.approveAuthor);
router.patch('/reject/:authorId', moderatorController.rejectAuthor);

module.exports = router;