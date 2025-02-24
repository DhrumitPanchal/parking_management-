// routes/parking.js
const express = require('express');
const router = express.Router();
const { getParkingSlots, getParkingSlot, createParkingSlot, updateParkingSlot, deleteParkingSlot } = require('../controllers/parkingController');
const auth = require('../middleware/auth');

router.get('/', getParkingSlots);
router.get('/:id', getParkingSlot);
router.post('/', auth, createParkingSlot);
router.put('/:id', auth, updateParkingSlot);
router.delete('/:id', auth, deleteParkingSlot);

module.exports = router;