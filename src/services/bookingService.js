/**
 * Booking Service
 * Handles all booking-related API calls
 */

import api from './api';

/**
 * Get bookings for a farm
 * @param {string} farmId - Farm ID
 * @returns {Promise<Array>}
 */
export const getBookingsByFarm = async (farmId) => {
  try {
    const response = await api.get(`/api/bookings/${farmId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

/**
 * Create a new booking
 * @param {object} bookingData - Booking data
 * @param {string} bookingData.farmId - Farm ID
 * @param {string} bookingData.userId - User ID
 * @param {string} bookingData.userName - User name
 * @param {string} bookingData.from - Start date
 * @param {string} bookingData.to - End date
 * @param {number} bookingData.totalPrice - Total price
 * @returns {Promise<object>}
 */
export const createBooking = async (bookingData) => {
  const response = await api.post('/api/bookings', bookingData);
  return response.data;
};

/**
 * Update booking status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status (pending, confirmed, cancelled)
 * @returns {Promise<object>}
 */
export const updateBookingStatus = async (bookingId, status) => {
  const response = await api.put(`/api/bookings/${bookingId}/status`, { status });
  return response.data;
};

/**
 * Confirm a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<object>}
 */
export const confirmBooking = async (bookingId) => {
  return updateBookingStatus(bookingId, 'confirmed');
};

/**
 * Cancel a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<object>}
 */
export const cancelBooking = async (bookingId) => {
  return updateBookingStatus(bookingId, 'cancelled');
};

/**
 * Get booking status display text
 * @param {string} status - Booking status
 * @returns {string}
 */
export const getBookingStatusText = (status) => {
  const statusMap = {
    confirmed: 'مؤكد',
    pending: 'في الانتظار',
    cancelled: 'ملغي',
  };
  return statusMap[status] || status;
};

/**
 * Get booking status color
 * @param {string} status - Booking status
 * @returns {string}
 */
export const getBookingStatusColor = (status) => {
  const colorMap = {
    confirmed: 'green',
    pending: 'orange',
    cancelled: 'red',
  };
  return colorMap[status] || '#333';
};

/**
 * Process bookings to get marked dates for calendar
 * @param {Array} bookings - Array of bookings
 * @returns {object} - Marked dates object for calendar
 */
export const processBookingsForCalendar = (bookings) => {
  const markedDates = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Mark past dates as disabled
  const pastDate = new Date(today);
  pastDate.setDate(pastDate.getDate() - 365);
  
  while (pastDate < today) {
    const dateStr = pastDate.toISOString().split('T')[0];
    markedDates[dateStr] = {
      disabled: true,
      disableTouchEvent: true,
      color: '#ccc',
      textColor: '#999',
    };
    pastDate.setDate(pastDate.getDate() + 1);
  }
  
  // Mark booked dates
  bookings?.forEach((booking) => {
    if (booking.status === 'cancelled') return;
    
    const current = new Date(booking.from);
    const last = new Date(booking.to);
    
    while (current < last) {
      const dateStr = current.toISOString().split('T')[0];
      
      if (booking.status === 'confirmed') {
        markedDates[dateStr] = {
          disabled: true,
          disableTouchEvent: true,
          color: '#e74c3c',
          textColor: 'white',
        };
      } else if (booking.status === 'pending') {
        markedDates[dateStr] = {
          disabled: true,
          disableTouchEvent: true,
          color: '#f39c12',
          textColor: 'white',
        };
      }
      
      current.setDate(current.getDate() + 1);
    }
  });
  
  return markedDates;
};
