const Farm = require('../Models/villa');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Get all farms with search and filter
const getFarms = async (req, res) => {
  try {
    const { type, search, page = 1, limit = 20 } = req.query;

    let filter = {};

    // Filter by type
    if (type && (type === "sale" || type === "rent")) {
      filter.type = type;
    }

    // Filter by search text (name)
    if (search && search.trim() !== "") {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const farms = await Farm.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Farm.countDocuments(filter);

    res.json({
      farms,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    console.error("Error fetching farms:", error);
    res.status(500).json({ message: "فشل في تحميل المزارع" });
  }
};

// Get single farm by ID
const getFarmById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'معرف المزرعة غير صحيح' });
    }

    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ message: 'المزرعة غير موجودة' });
    }
    res.json(farm);
  } catch (error) {
    console.error('Error fetching farm:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب بيانات المزرعة', error: error.message });
  }
};

// Create new farm
const createFarm = async (req, res) => {
  try {
    const { gfsBucket } = req.app.locals;
    const user = req.user;

    const {
      name, price, description, type, status, available, address,
      guests, bedrooms, bathrooms, weekendPrice, midweekPrice, sizeInHectares, ownerId, contactNumber, startBookingTime, endBookingTime
    } = req.body;

    // Validate required fields
    if (!name || !description || !type) {
      return res.status(400).json({ message: 'الرجاء تعبئة اسم ووصف ونوع المزرعة' });
    }

    if (type !== 'sale' && type !== 'rent') {
      return res.status(400).json({ message: 'نوع المزرعة يجب أن يكون sale أو rent' });
    }

    // Validate contact number
    const sanitizedContactNumber = String(contactNumber || '').trim();
    if (!sanitizedContactNumber || sanitizedContactNumber.length < 8) {
      return res.status(400).json({ message: 'الرجاء إدخال رقم اتصال صحيح' });
    }

    // Validate ownerId if provided, otherwise use current user
    let finalOwnerId = user.isAdmin && ownerId ? ownerId : user._id;
    if (ownerId && user.isAdmin) {
      if (!isValidObjectId(ownerId)) {
        return res.status(400).json({ message: 'معرف المالك غير صحيح' });
      }
      finalOwnerId = ownerId;
    }

    let parsedAddress = {};
    try {
      parsedAddress = address ? JSON.parse(address) : {};
    } catch (err) {
      parsedAddress = { fullAddress: address || "" };
    }

    // Handle image uploads
    let imagesIds = [];
    if (req.files && req.files.length > 0) {
      if (!gfsBucket) {
        return res.status(500).json({ message: 'خطأ في تحميل الصور، يرجى المحاولة لاحقاً' });
      }

      for (let file of req.files) {
        try {
          const uploadStream = gfsBucket.openUploadStream(
            Date.now() + '-' + file.originalname,
            { contentType: file.mimetype }
          );
          uploadStream.end(file.buffer);
        
          await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
          });
        
          imagesIds.push(uploadStream.id);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          // Continue with other images
        }
      }
    }

    const newFarm = new Farm({
      name: String(name).trim(),
      price: price ? Math.max(0, Number(price)) : 0,
      description: String(description).trim(),
      type,
      status: status || 'available',
      available: available !== undefined ? (available === 'true' || available === true) : true,
      address: parsedAddress,
      images: imagesIds,
      guests: guests ? Math.max(1, Number(guests)) : 1,
      bedrooms: bedrooms ? Math.max(1, Number(bedrooms)) : 1,
      bathrooms: bathrooms ? Math.max(1, Number(bathrooms)) : 1,
      weekendPrice: weekendPrice ? Math.max(0, Number(weekendPrice)) : 0,
      midweekPrice: midweekPrice ? Math.max(0, Number(midweekPrice)) : 0,
      sizeInHectares: type === 'sale' ? (sizeInHectares ? Math.max(0, Number(sizeInHectares)) : undefined) : undefined,
      ownerId: finalOwnerId,
      contactNumber: sanitizedContactNumber,
      startBookingTime: startBookingTime || "00:00",
      endBookingTime: endBookingTime || "23:59"
    });

    await newFarm.save();
    res.status(201).json({ message: 'تم إنشاء المزرعة بنجاح', farm: newFarm });
  } catch (error) {
    console.error('Error creating villa:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء المزرعة', error: error.message });
  }
};

// Update farm
const updateFarm = async (req, res) => {
  try {
    const { gfsBucket } = req.app.locals;
    const user = req.user;

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'معرف المزرعة غير صحيح' });
    }

    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'المزرعة غير موجودة' });

    const isOwner = String(farm.ownerId) === String(user._id);
    if (!user.isAdmin && !isOwner) {
      return res.status(403).json({ message: 'غير مصرح' });
    }

    const {
      name, price, description, type, status, available, address,
      guests, bedrooms, bathrooms, weekendPrice, midweekPrice, sizeInHectares, contactNumber, ownerId
    } = req.body;

    // Parse address if provided
    let parsedAddress = farm.address;
    if (address !== undefined) {
      try {
        parsedAddress = address ? JSON.parse(address) : {};
      } catch (err) {
        parsedAddress = { fullAddress: address || '' };
      }
    }

    // Handle new images if any
    let imagesIds = farm.images || [];
    if (req.files && req.files.length > 0) {
      if (!gfsBucket) {
        return res.status(500).json({ message: 'خطأ في تحميل الصور، يرجى المحاولة لاحقاً' });
      }

      // Delete old images if replacing
      if (imagesIds.length > 0 && gfsBucket) {
        for (const oldImageId of imagesIds) {
          try {
            await gfsBucket.delete(new mongoose.Types.ObjectId(oldImageId));
          } catch (deleteError) {
            // Ignore deletion errors
            console.error('Error deleting old image:', deleteError);
          }
        }
      }

      imagesIds = [];
      for (let file of req.files) {
        try {
          const uploadStream = gfsBucket.openUploadStream(
            Date.now() + '-' + file.originalname,
            { contentType: file.mimetype }
          );
          uploadStream.end(file.buffer);
          await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
          });
          imagesIds.push(uploadStream.id);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          // Continue with other images
        }
      }
    }

    // Validate type if provided
    if (type !== undefined && type !== 'sale' && type !== 'rent') {
      return res.status(400).json({ message: 'نوع المزرعة يجب أن يكون sale أو rent' });
    }

    // Validate contact number if provided
    if (contactNumber !== undefined) {
      const sanitizedContactNumber = String(contactNumber).trim();
      if (!sanitizedContactNumber || sanitizedContactNumber.length < 8) {
        return res.status(400).json({ message: 'الرجاء إدخال رقم اتصال صحيح' });
      }
      farm.contactNumber = sanitizedContactNumber;
    }

    // Apply updates only for provided fields
    if (name !== undefined) farm.name = String(name).trim();
    if (price !== undefined) farm.price = Math.max(0, Number(price) || 0);
    if (description !== undefined) farm.description = String(description).trim();
    if (type !== undefined) farm.type = type;
    if (status !== undefined) farm.status = status;
    if (available !== undefined) farm.available = available === 'true' || available === true;
    if (address !== undefined) farm.address = parsedAddress;
    if (req.files && req.files.length > 0) farm.images = imagesIds;
    if (guests !== undefined) farm.guests = Math.max(1, Number(guests) || 1);
    if (bedrooms !== undefined) farm.bedrooms = Math.max(1, Number(bedrooms) || 1);
    if (bathrooms !== undefined) farm.bathrooms = Math.max(1, Number(bathrooms) || 1);
    if (weekendPrice !== undefined) farm.weekendPrice = Math.max(0, Number(weekendPrice) || 0);
    if (midweekPrice !== undefined) farm.midweekPrice = Math.max(0, Number(midweekPrice) || 0);
    if (sizeInHectares !== undefined) farm.sizeInHectares = Math.max(0, Number(sizeInHectares) || 0);
    if (ownerId !== undefined && user.isAdmin && isValidObjectId(ownerId)) {
      farm.ownerId = ownerId; // only admin can reassign owner
    }

    await farm.save();
    res.json({ message: 'تم تحديث المزرعة بنجاح', farm });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث المزرعة', error: err.message });
  }
};

// Delete farm
const deleteFarm = async (req, res) => {
  try {
    const { gfsBucket } = req.app.locals;
    const user = req.user;

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'معرف المزرعة غير صحيح' });
    }

    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'المزرعة غير موجودة' });

    const isOwner = String(farm.ownerId) === String(user._id);
    if (!user.isAdmin && !isOwner) {
      return res.status(403).json({ message: 'غير مصرح' });
    }

    // Delete images from GridFS if they exist
    if (Array.isArray(farm.images) && farm.images.length > 0 && gfsBucket) {
      for (const fileId of farm.images) {
        try {
          await gfsBucket.delete(new mongoose.Types.ObjectId(fileId));
        } catch (_) {
          // Ignore deletion errors to avoid failing the entire operation
        }
      }
    }

    await Farm.findByIdAndDelete(farm._id);
    res.json({ message: 'تم حذف المزرعة بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف المزرعة', error: err.message });
  }
};

module.exports = {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm
};

