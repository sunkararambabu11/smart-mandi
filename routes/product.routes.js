const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const { protect, onlyFarmer } = require("../middleware/auth.middleware");

router.post("/", protect, onlyFarmer, productController.createProduct);
router.get("/", productController.getAllProducts);
router.put("/:productId", protect, onlyFarmer, productController.updateProduct);
router.delete("/:productId", protect, onlyFarmer, productController.deleteProduct);
router.get("/:productId", productController.getProductById);


module.exports = router;
