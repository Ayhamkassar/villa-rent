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

bookings: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String, 
    from: Date,
    to: Date,
    totalPrice: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  }
],
startBookingTime: { type: String, required: true }, // or Date if you want full datetime
endBookingTime: { type: String, required: true },
ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
sizeInHectares: { type: Number },
guests: { type: Number, default: 1 },          // عدد الضيوف
bedrooms: { type: Number, default: 1 },        // عدد غرف النوم
bathrooms: { type: Number, default: 1 },       // عدد الحمامات
weekendPrice: { type: Number, default: 0 },    // سعر نهاية الأسبوع
midweekPrice: { type: Number, default: 0 }     // سعر منتصف الأسبوع

}, { timestamps: true });

module.exports = mongoose.model('Farm', farmSchema);
