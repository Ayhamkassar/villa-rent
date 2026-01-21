const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {sendEmail} = require('../utils/SendEmail.js');

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.error('Missing fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ 
        message: 'يرجى إدخال جميع البيانات المطلوبة',
        received: { hasName: !!name, hasEmail: !!email, hasPassword: !!password }
      });
    }

    // Sanitize and validate email
    const sanitizedEmail = String(email).toLowerCase().trim();
    if (!sanitizedEmail || !isValidEmail(sanitizedEmail)) {
      console.error('Invalid email:', email);
      return res.status(400).json({ 
        message: 'البريد الإلكتروني غير صحيح',
        email: email
      });
    }

    // Validate name
    const sanitizedName = String(name).trim();
    if (!sanitizedName || sanitizedName.length < 2 || sanitizedName.length > 50) {
      console.error('Invalid name:', { name, length: sanitizedName?.length });
      return res.status(400).json({ 
        message: 'الاسم يجب أن يكون بين 2 و 50 حرفاً',
        nameLength: sanitizedName?.length || 0
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'البريد الإلكتروني مسجل مسبقاً' 
      });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'كلمة المرور يجب أن تكون 8 محارف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم'
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({ 
      name: sanitizedName, 
      email: sanitizedEmail, 
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationExpires: Date.now() + 3600000 // 1 hour
    });
    await newUser.save();

    // Send verification email
    const baseUrl = process.env.BASE_URL || 'https://api-villa-rent.onrender.com';
    await sendEmail({
      to: sanitizedEmail,
      subject: 'تفعيل الحساب',
      html: `
        <div style="font-family:Arial">
          <h2>مرحباً ${sanitizedName}</h2>
          <p>اضغط لتفعيل حسابك:</p>
          <a href="${baseUrl}/api/verify/${verificationToken}">
            تفعيل الحساب
          </a>
          <p>الرابط صالح لمدة ساعة</p>
        </div>
      `
    });
    
    // Create JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح. يرجى تفعيل حسابك عبر البريد الإلكتروني',
      token,
      user: { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email,
        isVerified: newUser.isVerified
      }
    });

  } catch (err) {
    console.error('خطأ في التسجيل:', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({ message: 'البريد الإلكتروني مسجل مسبقاً' });
    }
    res.status(500).json({ 
      message: 'حدث خطأ أثناء إنشاء الحساب',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'البريد الإلكتروني غير صحيح' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }
    
    if (!user.isVerified) {
      return res.status(403).json({ message: 'الحساب غير مفعل، تحقق من بريدك' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error('خطأ في تسجيل الدخول:', err);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'يرجى إدخال البريد الإلكتروني' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'البريد الإلكتروني غير صحيح' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ message: 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رمز إعادة التعيين' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(8).toString('hex').substring(0, 8);
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Save token and expiration (15 minutes)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      subject: 'إعادة تعيين كلمة المرور',
      html: `
        <div style="font-family:Arial">
          <h2>مرحباً ${user.name || ''}</h2>
          <p>رمز إعادة تعيين كلمة المرور:</p>
          <h1>${resetToken}</h1>
          <p>صالح لمدة 15 دقيقة</p>
        </div>
      `
    });
    
    res.json({ message: 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رمز إعادة التعيين' });
  } catch (err) {
    console.error('خطأ في forgot-password:', err);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'يرجى ملء جميع الحقول' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'البريد الإلكتروني غير صحيح' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // Verify token validity
    if (!user.resetPasswordToken || !user.resetPasswordExpires) {
      return res.status(400).json({ message: 'لا يوجد رمز لإعادة تعيين كلمة المرور' });
    }

    if (Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ message: 'انتهت صلاحية الرمز' });
    }

    const isMatch = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isMatch) {
      return res.status(400).json({ message: 'الرمز غير صحيح' });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'كلمة المرور يجب أن تكون 8 محارف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم'
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset token
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({ message: 'تم تحديث كلمة المرور بنجاح' });
  } catch (err) {
    console.error('خطأ في reset-password:', err);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};

// Verify account
const verifyAccount = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'الرابط غير صالح أو انتهت صلاحيته' 
      });
    }

    // Activate account
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationExpires = null;
    await user.save();

    res.json({ 
      message: 'تم تفعيل الحساب بنجاح',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (err) {
    console.error('خطأ في تفعيل الحساب:', err);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

// Resend activation email
const resendActivation = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'يرجى إدخال البريد الإلكتروني' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'البريد الإلكتروني غير صحيح' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: 'الحساب مفعل بالفعل' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const baseUrl = process.env.BASE_URL || 'https://api-villa-rent.onrender.com';
    await sendEmail({
      to: email,
      subject: 'تفعيل الحساب',
      html: `
        <div style="font-family:Arial">
          <h2>مرحباً ${user.name || ''}</h2>
          <a href="${baseUrl}/api/verify/${verificationToken}">
            تفعيل الحساب
          </a>
        </div>
      `
    });

    res.json({ message: 'تم إرسال رابط التفعيل من جديد' });
  } catch (err) {
    console.error('خطأ resend-activation:', err);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

// Check verification status
const checkVerification = async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    res.json({
      email: user.email,
      isVerified: user.isVerified,
      hasVerificationToken: !!user.verificationToken,
      tokenExpires: user.verificationExpires
    });

  } catch (err) {
    console.error('خطأ في التحقق من حالة التفعيل:', err);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyAccount,
  resendActivation,
  checkVerification
};
