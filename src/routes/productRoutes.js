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

router.get("/products/search", searchProducts);
router.get("/products", getProducts);
router.get("/products/all", getAllProductsWithCategoryName);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;
