const express = require('express');
const vetController = require('../controllers/vetController');
const asyncHandler = require('../middleware/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(authMiddleware, roleMiddleware('veterinarian'));

router.get('/me', asyncHandler(vetController.getMine));
router.put('/me', asyncHandler(vetController.updateMine));
router.get('/requests', asyncHandler(vetController.listRequests));
router.patch('/requests/:id', asyncHandler(vetController.respondToRequest));
router.get('/appointments', asyncHandler(vetController.listAppointments));
router.post('/diagnoses', asyncHandler(vetController.createDiagnosis));
router.post('/prescriptions', asyncHandler(vetController.createPrescription));

module.exports = router;