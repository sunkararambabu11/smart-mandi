const Product = require('../models/product');
const mongoose = require("mongoose");

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
      farmerId: req.user.userId
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
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    //  validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // only allow farmer to update own product
    const product = await Product.findOneAndUpdate(
      { _id: productId, farmerId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found or not allowed" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const product = await Product.findOneAndDelete({
      _id: productId,
      farmerId: req.user.userId
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found or not allowed" });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      productId
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

