const express = require('express');
const router = express.Router();
const {
  getFarmBookings,
  updateBookingStatus,
  deleteBooking
} = require('../Controllers/bookingController');
const { readLimiter } = require('../middleware/rateLimiting');

// Get bookings for a farm
router.get('/:farmId', readLimiter, getFarmBookings);

// Update booking status
router.put('/:bookingId/status', updateBookingStatus);

// Delete booking
router.delete('/:bookingId', deleteBooking);

module.exports = router;

