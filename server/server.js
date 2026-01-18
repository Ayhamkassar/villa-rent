// Load environment variables FIRST before anything else
// Check both current directory (server/) and parent directory (project root)
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
// Fallback: also try .env in server directory
if (!process.env.JWT_SECRET && !process.env.MONGO_URI) {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

// Security middleware
const { sanitizeInput } = require('./middleware/sanitization');
const {
  generalLimiter
} = require('./middleware/rateLimiting');

// Routes
const authRoutes = require('./routes/auth');
const farmRoutes = require('./routes/farm');
const userRoutes = require('./routes/user');
const bookingRoutes = require('./routes/booking');
const farmBookingRoutes = require('./routes/farmBooking');
const imageRoutes = require('./routes/image');

const app = express();

// Store GridFS bucket in app.locals for controllers to access
app.locals.gfsBucket = null;

// Security: Helmet for comprehensive security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow images from other origins
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow images to be embedded
}));

// Security: Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Default allowed origins including localhost for development
    const defaultOrigins = [
      'https://api-villa-rent.onrender.com',
    ];
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? [...defaultOrigins, ...process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())]
      : defaultOrigins;
    
    // In development or if '*' is in env, allow all; otherwise check whitelist
    if (process.env.NODE_ENV !== 'production' || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// Parse JSON bodies FIRST before sanitization
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

// Apply general rate limiting to all routes (after body parsing)
app.use(generalLimiter);

// Apply input sanitization to all routes (after body parsing)
app.use(sanitizeInput);

// =====================
// Validate Required Environment Variables
// =====================
const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

// Check if .env file exists
const envPathServer = path.join(__dirname, '.env'); // Also check server directory
const envExists = fs.existsSync(envPath) || fs.existsSync(envPathServer);

if (!envExists) {
  console.warn('\n⚠️  WARNING: .env file not found!');
  console.warn(`   Expected location: ${envPath}`);
  console.warn(`   Alternative location: ${envPathServer}`);
  console.warn('\n   Creating a template .env file...\n');
  
  // Create a basic .env file template
  const envTemplate = `# Villa Rent API - Environment Variables
# Required Variables
MONGO_URI=mongodb://https://api-villa-rent.onrender.com27017/villa-rent
JWT_SECRET=

# Optional Variables
PORT=3000
NODE_ENV=development
RESEND_API_KEY=
EMAIL_FROM=noreply@yourdomain.com
BASE_URL=https://api-villa-rent.onrender.com3000
ALLOWED_ORIGINS=
`;
  
  try {
    fs.writeFileSync(envPath, envTemplate);
    console.log(`✅ Created .env file at: ${envPath}`);
    console.log('   ⚠️  Please edit the .env file and add your values!\n');
  } catch (err) {
    console.error(`   Could not create .env file: ${err.message}`);
    console.warn(`   Please manually create .env at: ${envPath}\n`);
  }
}

// Validate JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error('\n❌ ERROR: JWT_SECRET is not set in .env file');
  console.error('   This is required for authentication tokens.');
  
  // In development, generate a temporary secret (not for production!)
  if (process.env.NODE_ENV !== 'production') {
    const crypto = require('crypto');
    const tempSecret = crypto.randomBytes(32).toString('hex');
    process.env.JWT_SECRET = tempSecret;
    console.warn(`   ⚠️  Using temporary JWT_SECRET for development: ${tempSecret.substring(0, 20)}...`);
    console.warn('   ⚠️  WARNING: Set a proper JWT_SECRET in .env for production!\n');
  } else {
    console.error('   Please set JWT_SECRET in your .env file.');
    console.error('   Example: JWT_SECRET=your_super_secret_key_here\n');
    process.exit(1);
  }
}

// Validate MONGO_URI
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('\n❌ ERROR: MONGO_URI is not set in .env file');
  console.error('   This is required to connect to MongoDB.');
  console.error('   Example: MONGO_URI=mongodb://https://api-villa-rent.onrender.com27017/villa-rent');
  console.error('   Or MongoDB Atlas: MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/villa-rent\n');
  process.exit(1);
}

// MongoDB connection options for better reliability
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5, // Maintain at least 5 socket connections
  retryWrites: true,
  w: 'majority',
  retryReads: true
};

// MongoDB connection with error handling
mongoose.connect(mongoURI, mongooseOptions)
  .then(() => {
    console.log('MongoDB connected successfully');
    // Initialize GridFS bucket after main connection is established
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
    // Don't exit on connection error - allow server to start and retry
    // The connection will retry automatically
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
  // Reinitialize GridFS after reconnection
  if (!app.locals.gfsBucket) {
    initializeGridFS();
  }
});

// GridFS bucket initialization
const initializeGridFS = () => {
  try {
    if (mongoose.connection.readyState === 1) { // 1 = connected
      app.locals.gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { 
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

// =====================
// API Routes
// =====================
app.use('/api', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/farms', farmBookingRoutes); // Additional farm booking routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
