const express = require('express');
const authController = require('../controllers/authController');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.get('/me', authMiddleware, asyncHandler(authController.getCurrentUser));

module.exports = router;