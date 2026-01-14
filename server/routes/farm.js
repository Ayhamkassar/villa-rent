const express = require('express');
const router = express.Router();
const {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm
} = require('../Controllers/farmController');
const authenticate = require('../middleware/auth');
const verifyAdmin = require('../middleware');
const { readLimiter, uploadLimiter } = require('../middleware/rateLimiting');
const upload = require('../config/multer');

// Get all farms (public, with search and filter)
router.get('/', readLimiter, getFarms);

// Get single farm by ID (public)
router.get('/:id', readLimiter, getFarmById);

// Create farm (authenticated)
router.post('/', uploadLimiter, upload.array('images', 10), authenticate, createFarm);

// Update farm (authenticated - owner or admin)
router.put('/:id', uploadLimiter, upload.array('images', 10), authenticate, updateFarm);

// Delete farm (authenticated - owner or admin)
router.delete('/:id', authenticate, deleteFarm);

module.exports = router;

