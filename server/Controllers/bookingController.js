const Booking = require('../Models/bookings');
const Farm = require('../Models/villa');
const mongoose = require('mongoose');
const { calculateBookingPrice } = require('../utils/calculatePrice');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Create booking
const createBooking = async (req, res) => {
  try {
    const { userId, userName, from, to } = req.body;
    
    if (!userId || !userName || !from || !to) {
      return res.status(400).json({ message: 'يرجى إدخال جميع البيانات المطلوبة' });
    }
    
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'المزرعة غير موجودة' });

    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ message: 'تواريخ غير صحيحة' });
    }
    
    // Validate dates are in the future
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (fromDate < now) {
      return res.status(400).json({ message: 'تاريخ البداية يجب أن يكون في المستقبل' });
    }
    
    if (fromDate >= toDate) {
      return res.status(400).json({ message: 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية' });
    }

    // Check for date overlap
    const existingBookings = await Booking.find({ farmId: farm._id, status: { $ne: 'cancelled' } });
    const isOverlap = existingBookings.some(b => {
      const bStart = new Date(b.from);
      const bEnd = new Date(b.to);
      return (fromDate < bEnd && toDate > bStart);
    });
    if (isOverlap) {
      return res.status(400).json({ message: 'التواريخ محجوزة مسبقاً' });
    }

    // Calculate price
    const totalPrice = calculateBookingPrice(farm, fromDate, toDate);

    // Create booking
    const newBooking = new Booking({
      farmId: farm._id,
      userId,
      userName,
      from: fromDate,
      to: toDate,
      totalPrice,
      status: 'pending'
    });
    await newBooking.save();

    res.json({ message: 'تم الحجز بنجاح', booking: newBooking, totalPrice });
  } catch (err) {
    console.error('خطأ في حجز المزرعة:', err);
    res.status(500).json({ 
      message: 'خطأ في السيرفر', 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Get bookings for a farm
const getFarmBookings = async (req, res) => {
  try {
    const { farmId } = req.params;
    
    // Validate farmId
    if (!farmId || !isValidObjectId(farmId)) {
      return res.status(400).json({ message: 'معرف المزرعة غير صحيح' });
    }
    
    const farmBookings = await Booking.find({ farmId })
      .populate('userId', 'name email');
    res.json(farmBookings);
  } catch (err) {
    console.error('خطأ في جلب الحجوزات:', err);
    res.status(500).json({ 
      message: 'خطأ في السيرفر', 
      error: err.message 
    });
  }
};

// Get booking quote (calculate price without creating booking)
const getBookingQuote = async (req, res) => {
  try {
    const { from, to } = req.body;
    const { id } = req.params;
    
    // Validate required fields
    if (!from || !to) {
      return res.status(400).json({ message: 'يرجى إدخال تواريخ البداية والنهاية' });
    }
    
    // Validate farmId
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ message: 'معرف المزرعة غير صحيح' });
    }
    
    const farm = await Farm.findById(id);
    if (!farm) return res.status(404).json({ message: 'المزرعة غير موجودة' });

    const start = new Date(from);
    const end = new Date(to);
    
    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'تواريخ غير صحيحة' });
    }
    
    // Validate dates are in the future
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (start < now) {
      return res.status(400).json({ message: 'تاريخ البداية يجب أن يكون في المستقبل' });
    }
    
    if (start >= end) {
      return res.status(400).json({ message: 'تاريخ النهاية يجب أن يكون بعد البداية' });
    }

    // Check for overlapping bookings
    const existingBookings = await Booking.find({ farmId: farm._id, status: { $ne: 'cancelled' } });
    const isOverlap = existingBookings.some(b => {
      const bStart = new Date(b.from);
      const bEnd = new Date(b.to);
      return start < bEnd && end > bStart;
    });
    if (isOverlap) {
      return res.status(400).json({ message: 'التواريخ محجوزة مسبقاً' });
    }

    // Calculate price
    const totalPrice = calculateBookingPrice(farm, start, end);

    res.json({ totalPrice });
  } catch (err) {
    console.error('خطأ في حساب السعر:', err);
    res.status(500).json({ 
      message: 'خطأ في السيرفر', 
      error: err.message 
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { bookingId } = req.params;
    
    // Validate required fields
    if (!status) {
      return res.status(400).json({ message: 'يرجى إدخال حالة الحجز' });
    }
    
    // Validate bookingId
    if (!bookingId || !isValidObjectId(bookingId)) {
      return res.status(400).json({ message: 'معرف الحجز غير صحيح' });
    }
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'حالة الحجز غير صحيحة' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate('userId', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }
    
    res.json({ message: 'تم تحديث حالة الحجز', booking });
  } catch (err) {
    console.error('خطأ في تحديث حالة الحجز:', err);
    res.status(500).json({ 
      message: 'خطأ في السيرفر', 
      error: err.message 
    });
  }
};

// Update booking status by farmId and bookingId
const updateBookingStatusByFarm = async (req, res) => {
  try {
    const { farmId, bookingId } = req.params;
    const { status } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({ message: 'يرجى إدخال حالة الحجز' });
    }
    
    // Validate farmId
    if (!farmId || !isValidObjectId(farmId)) {
      return res.status(400).json({ message: 'معرف المزرعة غير صحيح' });
    }
    
    // Validate bookingId
    if (!bookingId || !isValidObjectId(bookingId)) {
      return res.status(400).json({ message: 'معرف الحجز غير صحيح' });
    }

    const farm = await Farm.findById(farmId);
    if (!farm) return res.status(404).json({ message: 'المزرعة غير موجودة' });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'الحجز غير موجود' });

    booking.status = status;
    await booking.save();

    res.json({ message: 'تم تحديث حالة الحجز', booking });
  } catch (err) {
    console.error('خطأ في تحديث حالة الحجز:', err);
    res.status(500).json({ 
      message: 'خطأ في السيرفر', 
      error: err.message 
    });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.bookingId);
    res.json({ message: 'تم حذف الحجز' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

module.exports = {
  createBooking,
  getFarmBookings,
  getBookingQuote,
  updateBookingStatus,
  updateBookingStatusByFarm,
  deleteBooking
};

