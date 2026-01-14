const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 200
  },

  description: {
    type: String,
    trim: true
  },
  
  // Fixed: images should be array of ObjectIds for GridFS
  images: [{
    type: mongoose.Schema.Types.ObjectId
  }], 

  address: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    minlength: 8
  },

  price: {
    type: Number,
    required: true,
    min: 0
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
  
  startBookingTime: { 
    type: String, 
    default: "00:00"
  },
  
  endBookingTime: { 
    type: String, 
    default: "23:59"
  },
  
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  sizeInHectares: { 
    type: Number,
    min: 0
  },
  
  guests: { 
    type: Number, 
    default: 1,
    min: 1
  },
  
  bedrooms: { 
    type: Number, 
    default: 1,
    min: 1
  },
  
  bathrooms: { 
    type: Number, 
    default: 1,
    min: 1
  },
  
  weekendPrice: { 
    type: Number, 
    default: 0,
    min: 0
  },
  
  midweekPrice: { 
    type: Number, 
    default: 0,
    min: 0
  }

}, { timestamps: true });

// Add indexes for better query performance
farmSchema.index({ type: 1 });
farmSchema.index({ status: 1 });
farmSchema.index({ ownerId: 1 });
farmSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Farm', farmSchema);
