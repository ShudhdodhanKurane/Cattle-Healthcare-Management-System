const express = require('express');
const cattleController = require('../controllers/cattleController');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(authMiddleware, roleMiddleware('farmer'));

router.get('/', asyncHandler(cattleController.list));
router.post('/', asyncHandler(cattleController.create));
router.get('/:id', asyncHandler(cattleController.getById));
router.patch('/:id', asyncHandler(cattleController.update));
router.delete('/:id', asyncHandler(cattleController.remove));

module.exports = router;