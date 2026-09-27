const express = require('express');
const medicineController = require('../controllers/medicineController');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.get('/', asyncHandler(medicineController.list));
router.post('/', roleMiddleware('medical_store'), asyncHandler(medicineController.create));
router.get('/:id', asyncHandler(medicineController.getById));
router.patch('/:id', roleMiddleware('medical_store'), asyncHandler(medicineController.update));
router.delete('/:id', roleMiddleware('medical_store'), asyncHandler(medicineController.remove));

module.exports = router;