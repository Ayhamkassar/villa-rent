const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Get image by ID
const getImage = async (req, res) => {
  try {
    const { gfsBucket } = req.app.locals;

    if (!gfsBucket) {
      return res.status(503).json({ error: 'خدمة الصور غير متاحة حالياً' });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'معرف الصورة غير صحيح' });
    }

    const _id = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gfsBucket.openDownloadStream(_id);
    
    downloadStream.on('error', (err) => {
      if (!res.headersSent) {
        res.status(404).json({ error: 'الصورة غير موجودة' });
      }
    });

    // Set appropriate headers
    downloadStream.on('file', (file) => {
      res.set('Content-Type', file.contentType || 'image/jpeg');
      res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error('Error serving image:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'حدث خطأ أثناء جلب الصورة' });
    }
  }
};

module.exports = {
  getImage
};

