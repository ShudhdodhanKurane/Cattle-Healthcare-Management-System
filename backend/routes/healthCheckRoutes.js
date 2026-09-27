const express = require('express');
const healthCheckController = require('../controllers/healthCheckController');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(authMiddleware, roleMiddleware('farmer'));

router.get('/', asyncHandler(healthCheckController.list));
router.post('/', asyncHandler(healthCheckController.create));
router.get('/:id', asyncHandler(healthCheckController.getById));

module.exports = router;