const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingQuote,
  updateBookingStatusByFarm
} = require('../Controllers/bookingController');

// Get booking quote (calculate price without creating booking)
router.post('/quote/:id', getBookingQuote);

// Create booking for a farm
router.post('/book/:id', createBooking);

// Update booking status (by farmId and bookingId)
router.put('/:farmId/bookings/:bookingId/status', updateBookingStatusByFarm);

module.exports = router;

