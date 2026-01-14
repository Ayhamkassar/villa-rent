const express = require('express');
const router = express.Router();
const { getImage } = require('../Controllers/imageController');
const { readLimiter } = require('../middleware/rateLimiting');

// Get image by ID
router.get('/:id', readLimiter, getImage);

module.exports = router;

