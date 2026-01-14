const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadProfileImage
} = require('../Controllers/userController');
const authenticate = require('../middleware/auth');
const verifyAdmin = require('../middleware');
const { readLimiter, uploadLimiter } = require('../middleware/rateLimiting');
const upload = require('../config/multer');

// Get all users (admin only)
router.get('/', readLimiter, authenticate, verifyAdmin, getUsers);

// Get single user by ID (public but password excluded)
router.get('/:id', readLimiter, getUserById);

// Update user (authenticated - self or admin)
router.put('/:id', authenticate, updateUser);

// Delete user (admin only)
router.delete('/:id', authenticate, verifyAdmin, deleteUser);

// Upload profile image (authenticated - self or admin)
router.post('/upload/:id', uploadLimiter, upload.single('profileImage'), authenticate, uploadProfileImage);

module.exports = router;

