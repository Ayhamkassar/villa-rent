const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Default allowed origins including localhost for development
    const defaultOrigins = [
      'https://api-villa-rent.onrender.com',
      'https://api-villa-rent.onrender.com',
      'https://api-villa-rent.onrender.com',
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

module.exports = cors(corsOptions);

