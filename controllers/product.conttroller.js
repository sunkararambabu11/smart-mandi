const Product = require('../models/product.model');

exports.addProduct = async (req, res) => {
  try {
    const farmerId = req.user.userId;
    const {
      name,
      category,
      pricePerKg,
      quantity,
      unit,
      description,
      harvestDate,
      location
    } = req.body;

    if (
      !name ||
      !category ||
      !pricePerKg ||
      !quantity ||
      !harvestDate ||
      !location ||
      !location.state ||
      !location.district ||
      !location.pincode
    ) {
      return res.status(400).json({
        message: 'All required fields must be provided'
      });
    }


    const product = new Product({
      name,
      category,
      pricePerKg,
      quantity,
      unit,
      description,
      harvestDate,
      location,
      farmerId
    });


    await product.save();

  \
    return res.status(201).json({
      message: 'Product added successfully',
      product
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server error'
    });
  }
};
