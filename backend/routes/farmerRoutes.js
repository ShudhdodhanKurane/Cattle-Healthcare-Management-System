const express = require('express');
const farmerController = require('../controllers/farmerController');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.get('/me', roleMiddleware('farmer'), asyncHandler(farmerController.getMine));
router.put('/me', roleMiddleware('farmer'), asyncHandler(farmerController.updateMine));
router.get('/', roleMiddleware('admin', 'dairy_owner'), asyncHandler(farmerController.list));
router.get('/:id', roleMiddleware('admin', 'dairy_owner'), asyncHandler(farmerController.getById));

module.exports = router;