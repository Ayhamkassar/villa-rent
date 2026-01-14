// Verify admin middleware - should be used after authenticate middleware
// This checks if the authenticated user is an admin
async function verifyAdmin(req, res, next) {
  try {
    // If req.user is already set by authenticate middleware, use it
    // Otherwise, this is a fallback (for backward compatibility)
    if (!req.user) {
      return res.status(401).json({ message: 'غير مصرح، يرجى تسجيل الدخول' });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'غير مصرح - يجب أن تكون مسؤولاً' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'خطأ في التحقق من الصلاحيات' });
  }
}

module.exports = verifyAdmin;
  
