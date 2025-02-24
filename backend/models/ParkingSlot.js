// models/ParkingSlot.js
const mongoose = require('mongoose');

const ParkingSlotSchema = new mongoose.Schema({
  parkingId: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  slotNumber: {
    type: Number,
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User'  // Reference to the User model
   }
});

module.exports = mongoose.model('ParkingSlot', ParkingSlotSchema);