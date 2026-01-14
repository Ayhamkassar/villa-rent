const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('MONGO_URI is not set. Create a .env file in the project root (villa-rent) and set MONGO_URI.');
  process.exit(1);
}

// MongoDB connection options for better reliability
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  w: 'majority',
  retryReads: true
};

let gfsBucket;

// Initialize MongoDB connection
const connectDB = () => {
  return mongoose.connect(mongoURI, mongooseOptions)
    .then(() => {
      console.log('MongoDB connected successfully');
      initializeGridFS();
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      if (err.message.includes('ECONNRESET') || err.message.includes('whitelist')) {
        console.error('\n⚠️  Connection issue detected. Possible causes:');
        console.error('   1. Your IP address is not whitelisted in MongoDB Atlas');
        console.error('   2. Network connection issues');
        console.error('   3. MongoDB Atlas cluster is down or unreachable');
        console.error('\n   Check your MongoDB Atlas IP whitelist:');
        console.error('   https://www.mongodb.com/docs/atlas/security-whitelist/');
        console.error('\n   For development, you can temporarily allow all IPs (0.0.0.0/0)');
        console.error('   ⚠️  WARNING: Only use 0.0.0.0/0 for development, not production!\n');
      }
    });
};

// GridFS bucket initialization
const initializeGridFS = () => {
  try {
    if (mongoose.connection.readyState === 1) {
      gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { 
        bucketName: 'uploads' 
      });
      console.log('GridFS bucket initialized');
    } else {
      console.warn('GridFS initialization skipped - MongoDB not connected');
    }
  } catch (err) {
    console.error('Error initializing GridFS:', err.message);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
  if (!gfsBucket) {
    initializeGridFS();
  }
});

const getGfsBucket = () => gfsBucket;

module.exports = {
  connectDB,
  getGfsBucket,
  initializeGridFS
};

