const express = require('express');
const notificationController = require('../controllers/notificationController');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.get('/', asyncHandler(notificationController.list));
router.patch('/read-all', asyncHandler(notificationController.markAllRead));
router.patch('/:id/read', asyncHandler(notificationController.markRead));

module.exports = router;