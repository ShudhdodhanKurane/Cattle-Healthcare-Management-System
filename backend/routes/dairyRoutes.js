const express = require('express');
const dairyController = require('../controllers/dairyController');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(authMiddleware, roleMiddleware('dairy_owner'));

router.get('/me', asyncHandler(dairyController.getMine));
router.put('/me', asyncHandler(dairyController.updateMine));
router.get('/farmers', asyncHandler(dairyController.listFarmers));
router.post('/farmers', asyncHandler(dairyController.attachFarmer));

module.exports = router;