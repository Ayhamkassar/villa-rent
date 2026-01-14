const { body, param, query, validationResult } = require('express-validator');

/**
 * Sanitizes string inputs by trimming and escaping HTML
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

/**
 * Recursively sanitize objects
 */
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const sanitizedKey = sanitizeString(key);
      sanitized[sanitizedKey] = sanitizeObject(obj[key]);
    }
  }
  return sanitized;
};

/**
 * Middleware to sanitize request body, query, and params
 */
const sanitizeInput = (req, res, next) => {
  // Fields to exclude from sanitization (may contain legitimate special characters)
  // Adding 'name' and 'email' to prevent breaking registration
  const excludeFields = ['password', 'newPassword', 'currentPassword', 'description', 'address', 'html', 'name', 'email'];
  
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    try {
      // Make a safe copy without modifying the original
      const bodyCopy = JSON.parse(JSON.stringify(req.body));
      
      // Store excluded fields BEFORE sanitization
      const excludedValues = {};
      excludeFields.forEach(field => {
        if (bodyCopy[field] !== undefined) {
          excludedValues[field] = bodyCopy[field];
          // Remove from bodyCopy so it doesn't get sanitized
          delete bodyCopy[field];
        }
      });
      
      // Sanitize the body (without excluded fields)
      const sanitized = sanitizeObject(bodyCopy);
      
      // Merge sanitized body with excluded fields
      req.body = { ...sanitized, ...excludedValues };
      
      // Trim string fields (including excluded ones) for basic cleaning
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key].trim();
        }
      });
    } catch (error) {
      // If sanitization fails, continue with original body
      console.error('Sanitization error:', error.message);
      // Still trim strings as basic cleaning
      if (req.body && typeof req.body === 'object') {
        Object.keys(req.body).forEach(key => {
          if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
          }
        });
      }
    }
  }

  // Sanitize query parameters (always sanitize these)
  if (req.query && typeof req.query === 'object') {
    try {
      req.query = sanitizeObject(req.query);
    } catch (error) {
      console.error('Query sanitization error:', error.message);
    }
  }

  // Sanitize URL parameters (always sanitize these)
  if (req.params && typeof req.params === 'object') {
    try {
      req.params = sanitizeObject(req.params);
    } catch (error) {
      console.error('Params sanitization error:', error.message);
    }
  }

  next();
};

/**
 * Validation error handler middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Common validation rules
 */
const commonValidations = {
  email: body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  name: body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\u0600-\u06FF\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  objectId: param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),

  search: query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query too long'),

  page: query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
};

module.exports = {
  sanitizeInput,
  handleValidationErrors,
  commonValidations,
  sanitizeString,
  sanitizeObject
};

