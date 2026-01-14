const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyAccount,
  resendActivation,
  checkVerification
} = require('../Controllers/authController');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiting');

// Register
router.post('/register', authLimiter, register);

// Login
router.post('/login', authLimiter, login);

// Forgot password
router.post('/forgot-password', passwordResetLimiter, forgotPassword);

// Reset password
router.post('/reset-password', passwordResetLimiter, resetPassword);

// Verify account
router.get('/verify/:token', verifyAccount);

// Resend activation email
router.post('/resend-activation', authLimiter, resendActivation);

// Check verification status
router.get('/check-verification/:email', checkVerification);

module.exports = router;
