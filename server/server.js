const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('./Models/User');
const Farm = require('./Models/villa');
const verifyAdmin = require('./middleware');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bookings = require('./Models/bookings');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =====================
//إعداد SMTP
// =====================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  }
});
// =====================
// اتصال MongoDB
// =====================
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('MONGO_URI is not set. Create a .env file in the project root (villa-rent) and set MONGO_URI.');
  process.exit(1);
}

mongoose.connect(mongoURI);

const conn = mongoose.createConnection(mongoURI);

let gfsBucket;
conn.once('open', () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'uploads' });
});


const storage = multer.memoryStorage();
const upload = multer({ storage });
// =====================
//EndPoint لإرسال رابط إعادة التعيين
// =====================
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'يرجى إدخال البريد الإلكتروني' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    // توليد رمز مؤقت (Token)
    const resetToken = Math.random().toString(36).substr(2, 8); // رمز 8 أحرف
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // حفظ الرمز المؤقت في قاعدة البيانات مع تاريخ انتهاء الصلاحية (مثلاً 15 دقيقة)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 دقيقة
    await user.save();

    // إعداد الرسالة
    const mailOptions = {
      from: 'myvilla234@gmail.com',
      to: email,
      subject: 'إعادة تعيين كلمة المرور',
      text: `مرحبا ${user.name || ''},\n\nرمز إعادة تعيين كلمة المرور الخاص بك هو:\n\n${resetToken}\n\nصالح لمدة 15 دقيقة.\n\nإذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذه الرسالة.`
    };
// =====================
//إرسال البريد
// =====================
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error(error);
    return res.status(500).json({ message: 'حدث خطأ أثناء إرسال البريد' });
  } else {
    console.log('Email sent: ' + info.response);
    res.json({ message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك' });
  }
});

} catch (err) {
console.error(err);
res.status(500).json({ message: 'حدث خطأ في السيرفر' });
}
});
// =====================
// إعادة إرسال الإيميل
// =====================
app.post('/api/resend-activation', async()=>{
  
  try {
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword,isVerified: false,
      verificationToken,
      verificationExpires: Date.now() + 3600000 });
    await newUser.save();

    const mailOptions = {
      from: process.env.user,
      to: email,
      subject: 'تفعيل الحساب',
      text: `مرحبا ${name},\n\nاضغط الرابط لتفعيل حسابك:\nhttps://api-villa-rent.onrender.com/api/verify/${verificationToken}\n\n`
    };

   await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('خطأ في إرسال البريد:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحساب' });
  }
});

app.get('/api/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'الرابط غير صالح أو انتهت صلاحيته' });

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationExpires = null;

    await user.save();

    res.json({ message: 'تم تفعيل الحساب بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});
// =====================
// تسجيل مستخدم جديد
// =====================
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'البريد الإلكتروني مسجل مسبقاً' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'كلمة المرور يجب أن تكون 8 محارف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم'
    });
  }

  try {
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword,isVerified: false,
      verificationToken,
      verificationExpires: Date.now() + 3600000 });
    await newUser.save();

    const mailOptions = {
      from: process.env.user,
      to: email,
      subject: 'تفعيل الحساب',
      text: `مرحبا ${name},\n\nاضغط الرابط لتفعيل حسابك:\nhttps://api-villa-rent.onrender.com/api/verify/${verificationToken}\n\n`
    };

   await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('خطأ في إرسال البريد:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحساب' });
  }
});

app.get('/api/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'الرابط غير صالح أو انتهت صلاحيته' });

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationExpires = null;

    await user.save();

    res.json({ message: 'تم تفعيل الحساب بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});
// =====================
//البحث و الفلترة
// =====================
app.get("/api/farms", async (req, res) => {
  try {
    const { type, search } = req.query;

    let filter = {};

    // فلترة حسب النوع
    if (type && (type === "sale" || type === "rent")) {
      filter.type = type;
    }

    // فلترة حسب نص البحث بالاسم
    if (search && search.trim() !== "") {
      filter.name = { $regex: search.trim(), $options: "i" }; // i => insensitive
    }

    const farms = await Farm.find(filter).sort({ createdAt: -1 });
    res.json(farms);
  } catch (error) {
    console.error("Error fetching farms:", error);
    res.status(500).json({ message: "فشل في تحميل المزارع" });
  }
});
// =====================
// تسجيل دخول مستخدم
// =====================
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'البريد الإلكتروني غير موجود' });
  }
  if (!user.isVerified) {
    return res.status(403).json({ message: 'الحساب غير مفعل، تحقق من بريدك' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'كلمة المرور غير صحيحة' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({
    message: 'تم تسجيل الدخول بنجاح',
    token,
    user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
  });
});
// =====================
// إعادة تعيين كلمة المرور
// =====================
app.post('/api/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ message: 'يرجى ملء جميع الحقول' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    // تحقق من صلاحية الرمز
    if (!user.resetPasswordToken || !user.resetPasswordExpires) {
      return res.status(400).json({ message: 'لا يوجد رمز لإعادة تعيين كلمة المرور' });
    }

    if (Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ message: 'انتهت صلاحية الرمز' });
    }

    const isMatch = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isMatch) return res.status(400).json({ message: 'الرمز غير صحيح' });

    // تحديث كلمة المرور
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // مسح الرمز بعد التحديث
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({ message: 'تم تحديث كلمة المرور بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
});

// =====================
// إنشاء فيلا جديدة مع رفع صورها
// =====================
app.post('/api/villa', upload.array('images', 10), async (req, res) => {
  try {
    const {
      name, price, description, type, status, available, address,
      guests, bedrooms, bathrooms, weekendPrice, midweekPrice, sizeInHectares, ownerId, contactNumber, startBookingTime, endBookingTime
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'الرجاء تعبئة اسم ووصف المزرعة' });
    }

    let parsedAddress = {};
    try {
      parsedAddress = address ? JSON.parse(address) : {};
    } catch (err) {
      parsedAddress = { fullAddress: address || "" };
    }

    let imagesIds = [];
    for (let file of req.files) {
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
    }
    
    
    

    const newFarm = new Farm({
      name,
      price: price ? Number(price) : 0,
      description,
      type,
      status: status || 'available',
      available: available !== undefined ? available === 'true' : true,
      address: parsedAddress,
      images: imagesIds,
      guests: guests ? Number(guests) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      weekendPrice: weekendPrice ? Number(weekendPrice) : undefined,
      midweekPrice: midweekPrice ? Number(midweekPrice) : undefined,
      sizeInHectares: type === 'sale' ? (sizeInHectares ? Number(sizeInHectares) : 0) : undefined,
      ownerId: ownerId || null,
      contactNumber: contactNumber || "",
      startBookingTime: startBookingTime || "00:00",
      endBookingTime: endBookingTime || "23:59"
    });

    await newFarm.save();
    res.status(201).json({ message: 'تم إنشاء المزرعة بنجاح', farm: newFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء المزرعة', error: error.message });
  }
});

// =====================
// جلب كل الفيلات
// =====================
app.get('/api/farms', async (req, res) => {
  try {
    const farms = await Farm.find();
    res.json(farms);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب المزارع' });
  }
});

// =====================
// جلب صورة عبر GridFS
// =====================
app.get('/api/images/:id', async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gfsBucket.openDownloadStream(_id);
    downloadStream.pipe(res);

    downloadStream.on('error', () => {
      res.status(404).json({ error: 'الصورة غير موجودة' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// جلب فيلا واحدة
// =====================
app.get('/api/farms/:id', async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ message: 'المزرعة غير موجودة' });
    }
    res.json(farm);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب بيانات المزرعة', error: error.message });
  }
});

// =====================
// تحديث بيانات فيلا (admin أو المالك فقط)
// =====================
app.put('/api/farms/:id', upload.array('images', 10), async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'لا يوجد توكن' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'توكن غير صالح' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'المستخدم غير موجود' });

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
    let imagesIds = farm.images;
    if (req.files && req.files.length > 0) {
      imagesIds = [];
      for (let file of req.files) {
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
      }
    }

    // Apply updates only for provided fields
    if (name !== undefined) farm.name = name;
    if (price !== undefined) farm.price = Number(price) || 0;
    if (description !== undefined) farm.description = description;
    if (type !== undefined) farm.type = type;
    if (status !== undefined) farm.status = status;
    if (available !== undefined) farm.available = available === 'true' || available === true;
    if (address !== undefined) farm.address = parsedAddress;
    if (imagesIds !== farm.images) farm.images = imagesIds;
    if (guests !== undefined) farm.guests = Number(guests) || 0;
    if (bedrooms !== undefined) farm.bedrooms = Number(bedrooms) || 0;
    if (bathrooms !== undefined) farm.bathrooms = Number(bathrooms) || 0;
    if (weekendPrice !== undefined) farm.weekendPrice = Number(weekendPrice) || 0;
    if (midweekPrice !== undefined) farm.midweekPrice = Number(midweekPrice) || 0;
    if (sizeInHectares !== undefined) farm.sizeInHectares = Number(sizeInHectares) || 0;
    if (contactNumber !== undefined) farm.contactNumber = contactNumber;
    if (ownerId !== undefined && user.isAdmin) farm.ownerId = ownerId; // only admin can reassign owner

    await farm.save();
    res.json({ message: 'تم تحديث المزرعة بنجاح', farm });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث المزرعة', error: err.message });
  }
});

// =====================
// حذف فيلا (admin أو المالك فقط)
// =====================
app.delete('/api/farms/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'لا يوجد توكن' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'توكن غير صالح' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'المستخدم غير موجود' });

    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'المزرعة غير موجودة' });

    const isOwner = String(farm.ownerId) === String(user._id);
    if (!user.isAdmin && !isOwner) {
      return res.status(403).json({ message: 'غير مصرح' });
    }

    // حذف الصور من GridFS إن وجدت
    if (Array.isArray(farm.images) && farm.images.length > 0 && gfsBucket) {
      for (const fileId of farm.images) {
        try {
          await gfsBucket.delete(new mongoose.Types.ObjectId(fileId));
        } catch (_) {
          // تجاهل أخطاء حذف الصورة لتجنب فشل العملية كاملة
        }
      }
    }

    await Farm.findByIdAndDelete(farm._id);
    res.json({ message: 'تم حذف المزرعة بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف المزرعة', error: err.message });
  }
});

// =====================
// رفع صورة بروفايل مستخدم
// =====================
app.post('/api/users/upload/:id', upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'لا يوجد ملف مرفوع' });

    const uploadStream = gfsBucket.openUploadStream(
      Date.now() + '-' + req.file.originalname,
      { contentType: req.file.mimetype }
    );
    uploadStream.end(req.file.buffer);
    const uploadedFile = await new Promise((resolve, reject) => {
      uploadStream.on('finish', () => {
        resolve(uploadStream.id); // ID من GridFS
      });
      uploadStream.on('error', reject);
    });
    
    const imagePath = `/api/images/${uploadedFile}`; // استخدم uploadedFile مباشرة كـ ID

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profileImage: imagePath },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ', error: err.message });
  }
});

// =====================
// حجز فيلا
// =====================
// POST /api/farms/book/:id

app.post('/api/farms/book/:id', async (req, res) => {
  try {
    const { userId, userName, from, to } = req.body;
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'المزرعة غير موجودة' });

    // التحقق من التداخل
    const existingBookings = await bookings.find({ farmId: farm._id });
    const isOverlap = existingBookings.some(b =>
      (new Date(from) <= b.to && new Date(to) >= b.from)
    );
    if (isOverlap) {
      return res.status(400).json({ message: 'التواريخ محجوزة مسبقاً' });
    }

    // حساب السعر
    let totalPrice = 0;
    let current = new Date(from);
    while (current <= new Date(to)) {
      const day = current.getDay();
      if (day === 4 || day === 5 || day === 6) {
        totalPrice += farm.weekendPrice;
      } else {
        totalPrice += farm.midweekPrice;
      }
      current.setDate(current.getDate() + 1);
    }

    // إنشاء الحجز
    const newBooking = new bookings({
      farmId: farm._id,
      userId,
      userName,
      from,
      to,
      totalPrice,
      status: 'pending'
    });
    await newBooking.save();

    res.json({ message: 'تم الحجز بنجاح', booking: newBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});



// =====================
// جلب جميع المستخدمين (admin فقط)
// =====================
app.get('/api/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =====================
// جلب بيانات مستخدم واحد
// =====================
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// =====================
// جلب كل الحجوزات لمزرعة واحدة
// =====================
app.get('/api/bookings/:farmId', async (req, res) => {
  try {
    const bookings = await bookings.find({ farmId: req.params.farmId })
      .populate('userId', 'name email');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});

// =====================
// تحديث بيانات مستخدم (صاحب الحساب أو admin)
// =====================
app.put('/api/users/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'لا يوجد توكن' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'توكن غير صالح' });
    }

    const requester = await User.findById(decoded.userId);
    if (!requester) return res.status(401).json({ message: 'المستخدم غير موجود' });

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
});
// =====================
// تعديل حالة الحجز
// =====================
app.put('/api/bookings/:bookingId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await bookings.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'الحجز غير موجود' });

    booking.status = status;
    await booking.save();

    res.json({ message: 'تم تحديث حالة الحجز', booking });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});
// =====================
// حذف حجز
// =====================
app.delete('/api/bookings/:bookingId', async (req, res) => {
  try {
    await bookings.findByIdAndDelete(req.params.bookingId);
    res.json({ message: 'تم حذف الحجز' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});


// =====================
// حذف مستخدم (admin فقط)
// =====================
app.delete('/api/users/:id', verifyAdmin, async (req, res) => {
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
});

// =====================
// عرض السعر و التأكد من الحجز
// =====================

app.post('/api/farms/quote/:id', async (req, res) => {
  try {
    const { from, to } = req.body;
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'المزرعة غير موجودة' });

    const start = new Date(from);
    const end   = new Date(to);
    if (!(start < end)) {
      return res.status(400).json({ message: 'تاريخ النهاية يجب أن يكون بعد البداية' });
    }

    const isOverlap = farm.bookings.some(b => {
      const bStart = new Date(b.from);
      const bEnd   = new Date(b.to);
      return start < bEnd && end > bStart;
    });
    if (isOverlap) {
      return res.status(400).json({ message: 'التواريخ محجوزة مسبقاً' });
    }

    let totalPrice = 0;
    const cursor = new Date(start);
    while (cursor < end) {
      const day = cursor.getDay();
      if (day === 4 || day === 5 || day === 6) {
        totalPrice += Number(farm.weekendPrice || 0);
      } else {
        totalPrice += Number(farm.midweekPrice || 0);
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    res.json({ totalPrice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});
// =====================
// تغيير حالة الحجز
// =====================
app.put('/api/farms/:farmId/bookings/:bookingId/status', async (req, res) => {
  try {
    const { farmId, bookingId } = req.params;
    const { status } = req.body; // ex: "cancelled" or "confirmed"

    const farm = await Farm.findById(farmId);
    if (!farm) return res.status(404).json({ message: 'المزرعة غير موجودة' });

    const booking = farm.bookings.id(bookingId);
    if (!booking) return res.status(404).json({ message: 'الحجز غير موجود' });

    booking.status = status;
    await farm.save();

    res.json({ message: 'تم تحديث حالة الحجز', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
});
// =====================
// تشغيل السيرفر
// =====================
app.listen(3000, '0.0.0.0',() => console.log('Server running on port 3000'));
