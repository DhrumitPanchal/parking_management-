// controllers/parkingController.js
const ParkingSlot = require('../models/ParkingSlot');

// @desc    Get all parking slots
// @route   GET /api/parking
// @access  Public
exports.getParkingSlots = async (req, res) => {
  try {
    const parkingSlots = await ParkingSlot.find();
    res.json(parkingSlots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get a single parking slot
// @route   GET /api/parking/:id
// @access  Public
exports.getParkingSlot = async (req, res) => {
  try {
    const parkingSlot = await ParkingSlot.findById(req.params.id);
    if (!parkingSlot) {
      return res.status(404).json({ msg: 'Parking slot not found' });
    }
    res.json(parkingSlot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Create a parking slot
// @route   POST /api/parking
// @access  Private
exports.createParkingSlot = async (req, res) => {
  const { parkingId, location, slotNumber, vehicleType, vehicleNumber, startTime, endTime } = req.body;

  try {
    const newParkingSlot = new ParkingSlot({
      parkingId,
      location,
      slotNumber,
      vehicleType,
      vehicleNumber,
      startTime,
      endTime,
      userId: req.user.id  //Associate with logged in User
    });

    const parkingSlot = await newParkingSlot.save();

    res.json(parkingSlot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update a parking slot
// @route   PUT /api/parking/:id
// @access  Private
exports.updateParkingSlot = async (req, res) => {
  const { parkingId, location, slotNumber, vehicleType, vehicleNumber, startTime, endTime, isBooked } = req.body;

  // Build parking slot object
  const parkingSlotFields = {};
  if (parkingId) parkingSlotFields.parkingId = parkingId;
  if (location) parkingSlotFields.location = location;
  if (slotNumber) parkingSlotFields.slotNumber = slotNumber;
  if (vehicleType) parkingSlotFields.vehicleType = vehicleType;
  if (vehicleNumber) parkingSlotFields.vehicleNumber = vehicleNumber;
  if (startTime) parkingSlotFields.startTime = startTime;
  if (endTime) parkingSlotFields.endTime = endTime;
  if (isBooked) parkingSlotFields.isBooked = isBooked; //Allow updating booked status

  try {
    let parkingSlot = await ParkingSlot.findById(req.params.id);

    if (!parkingSlot) {
      return res.status(404).json({ msg: 'Parking slot not found' });
    }

    // Make sure user owns parking slot
    if (parkingSlot.userId.toString() !== req.user.id && req.user.role !== 'admin' ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    parkingSlot = await ParkingSlot.findByIdAndUpdate(
      req.params.id,
      { $set: parkingSlotFields },
      { new: true }
    );

    res.json(parkingSlot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete a parking slot
// @route   DELETE /api/parking/:id
// @access  Private
exports.deleteParkingSlot = async (req, res) => {
  try {
    let parkingSlot = await ParkingSlot.findById(req.params.id);

    if (!parkingSlot) {
      return res.status(404).json({ msg: 'Parking slot not found' });
    }

     // Make sure user owns parking slot or is an admin
    if (parkingSlot.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await parkingSlot.remove();

    res.json({ msg: 'Parking slot removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

