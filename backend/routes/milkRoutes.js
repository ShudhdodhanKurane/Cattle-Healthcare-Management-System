const express = require('express');
const milkController = require('../controllers/milkController');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(authMiddleware, roleMiddleware('dairy_owner', 'farmer', 'admin'));

router.get('/', asyncHandler(milkController.list));
router.post('/', roleMiddleware('dairy_owner'), asyncHandler(milkController.create));
router.get('/:id', asyncHandler(milkController.getById));
router.patch('/:id', roleMiddleware('dairy_owner'), asyncHandler(milkController.update));

module.exports = router;