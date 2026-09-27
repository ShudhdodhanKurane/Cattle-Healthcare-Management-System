const express = require('express');
const complaintController = require('../controllers/complaintController');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

router.get('/', asyncHandler(complaintController.list));
router.post('/', asyncHandler(complaintController.create));
router.get('/:id', asyncHandler(complaintController.getById));
router.patch('/:id', asyncHandler(complaintController.update));

module.exports = router;