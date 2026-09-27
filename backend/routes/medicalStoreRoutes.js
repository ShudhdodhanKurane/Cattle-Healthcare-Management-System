const express = require('express');
const medicalStoreController = require('../controllers/medicalStoreController');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(authMiddleware, roleMiddleware('medical_store'));

router.get('/me', asyncHandler(medicalStoreController.getMine));
router.put('/me', asyncHandler(medicalStoreController.updateMine));
router.get('/orders', asyncHandler(medicalStoreController.listOrders));
router.patch('/orders/:id/status', asyncHandler(medicalStoreController.updateOrderStatus));

module.exports = router;