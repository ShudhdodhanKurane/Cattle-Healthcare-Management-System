const express = require('express');
const paymentController = require('../controllers/paymentController');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.get('/', asyncHandler(paymentController.list));
router.post('/', asyncHandler(paymentController.create));
router.get('/:id', asyncHandler(paymentController.getById));
router.patch('/:id/status', roleMiddleware('admin'), asyncHandler(paymentController.updateStatus));

module.exports = router;