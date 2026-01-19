const express = require('express');
const router = express.Router();

const { protect, onlyFarmer } = require('../middleware/auth.middleware');
const { createProduct } = require('../controllers/product.controller');

router.post('/', protect, onlyFarmer, createProduct);

module.exports = router;
