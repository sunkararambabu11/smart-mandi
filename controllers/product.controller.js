const Product = require('../models/product.model');

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      pricePerKg,
      quantity,
      unit,
      description,
      harvestDate,
      location,
      media
    } = req.body;

    // basic validation
    if (!name || !category || !pricePerKg || !quantity || !harvestDate || !location) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    if (!location.state || !location.district || !location.pincode) {
      return res.status(400).json({ message: 'Location fields missing' });
    }

    const product = await Product.create({
      name,
      category,
      pricePerKg,
      quantity,
      unit,
      description,
      harvestDate,
      location,
      media: media || [],
      farmerId: req.user._id
    });

    return res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
