const User = require('../Models/User');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const requester = req.user;
    const targetId = req.params.id;
    const isSelf = String(requester._id) === String(targetId);
    
    if (!isSelf && !requester.isAdmin) {
      return res.status(403).json({ message: 'غير مصرح' });
    }

    const updates = {};
    if (req.body.name !== undefined) updates.name = String(req.body.name).trim();

    const updated = await User.findByIdAndUpdate(targetId, updates, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'المستخدم غير موجود' });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث المستخدم' });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    if (String(req.user._id) === String(targetUserId)) {
      return res.status(400).json({ message: 'لا يمكنك حذف حسابك الخاص' });
    }

    const user = await User.findByIdAndDelete(targetUserId);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    res.json({ message: 'تم حذف المستخدم بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف المستخدم', error: err.message });
  }
};

// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    const { gfsBucket } = req.app.locals;
    const requester = req.user;

    // Check if user is updating their own profile or is admin
    const targetId = req.params.id;
    const isSelf = String(requester._id) === String(targetId);
    if (!isSelf && !requester.isAdmin) {
      return res.status(403).json({ message: 'غير مصرح' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'لا يوجد ملف مرفوع' });
    }

    if (!gfsBucket) {
      return res.status(500).json({ message: 'خدمة رفع الصور غير متاحة حالياً' });
    }

    // Delete old profile image if exists
    const targetUser = await User.findById(targetId);
    if (targetUser && targetUser.profileImage) {
      const oldImageId = targetUser.profileImage.split('/').pop();
      if (oldImageId && isValidObjectId(oldImageId)) {
        try {
          await gfsBucket.delete(new mongoose.Types.ObjectId(oldImageId));
        } catch (deleteError) {
          // Ignore deletion errors
          console.error('Error deleting old profile image:', deleteError);
        }
      }
    }

    const uploadStream = gfsBucket.openUploadStream(
      Date.now() + '-' + req.file.originalname,
      { contentType: req.file.mimetype }
    );
    uploadStream.end(req.file.buffer);
    
    const uploadedFile = await new Promise((resolve, reject) => {
      uploadStream.on('finish', () => {
        resolve(uploadStream.id);
      });
      uploadStream.on('error', reject);
    });
    
    const imagePath = `/api/images/${uploadedFile}`;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profileImage: imagePath },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error uploading profile image:', err);
    res.status(500).json({ message: 'حدث خطأ', error: err.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadProfileImage
};

