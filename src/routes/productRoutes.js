const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getAllProductsWithCategoryName,
} = require("../controllers/productController");
const authenticateToken = require('../middleware/auth');

router.get("/products/search", authenticateToken, searchProducts);
router.get("/products", authenticateToken, getProducts);
router.get("/products/all", authenticateToken, getAllProductsWithCategoryName);
router.get("/products/:id", authenticateToken, getProductById);
router.post("/products", authenticateToken, createProduct);
router.put("/products/:id", authenticateToken, updateProduct);
router.delete("/products/:id",authenticateToken, deleteProduct);

module.exports = router;
