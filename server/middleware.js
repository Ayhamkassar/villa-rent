const jwt = require('jsonwebtoken');
const User = require('./Models/User');

async function verifyAdmin(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'لا يوجد توكن' });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
  
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: 'غير مصرح' });
      }
  
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: 'توكن غير صالح' });
    }
  };

  module.exports = verifyAdmin;
  
