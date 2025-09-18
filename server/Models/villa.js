const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: String,
  images: [
    {
      data: Buffer,
      contentType: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'uploads.files' 
    }
  ], 

  address: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  contactNumber: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    enum: ['rent', 'sale'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'sold', 'rented'],
    default: 'available'
  },

  available: {
    type: Boolean,
    default: true
  },
  startBookingTime: { type: String, required: true },
  endBookingTime: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sizeInHectares: { type: Number },
  guests: { type: Number, default: 1 },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  weekendPrice: { type: Number, default: 0 },
  midweekPrice: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model('Farm', farmSchema);
