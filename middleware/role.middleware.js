exports.isFarmer = (req, res, next) => {
  if (req.user.role !== 'FARMER') {
    return res.status(403).json({
      message: 'Access denied. Farmers only.'
    });
  }
  next();
};
