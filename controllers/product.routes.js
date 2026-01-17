const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const { isFarmer } = require('../middleware/role.middleware');
const { addProduct } = require('../controllers/product.controller');
router.post(
  '/',
  authMiddleware,
  isFarmer,
  addProduct
);

module.exports = router;
