const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
exports.onlyFarmer = (req, res, next) => {
  if (req.user.role !== 'FARMER') {
    return res.status(403).json({ message: 'Only FARMER can add products' });
  }
  next();
};
