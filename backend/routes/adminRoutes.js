const express = require('express');
const adminController = require('../controllers/adminController');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(authMiddleware, roleMiddleware('admin'));

router.get('/me', asyncHandler(adminController.getMine));
router.put('/me', asyncHandler(adminController.updateMine));
router.get('/stats', asyncHandler(adminController.getStats));
router.get('/users', asyncHandler(adminController.listUsers));
router.patch('/users/:id/status', asyncHandler(adminController.updateUserStatus));
router.patch('/profiles/:role/:id/verification', asyncHandler(adminController.verifyProfile));

module.exports = router;