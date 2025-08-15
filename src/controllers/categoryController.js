const { db } = require('../config/db');
const cloudinary = require('../config/cloudinary');

// GET all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await db`SELECT * FROM categories`;
    res.json({ success: true, data: categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db`SELECT * FROM categories WHERE id = ${id}`;
    if (result.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ success: true, data: result[0] });
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST create category
exports.createCategory = async (req, res) => {
  const { name, image_url } = req.body;
  try {
    if (!name || !image_url) {
      return res.status(400).json({ error: "Name and image are required" });
    }

    const existingCategory = await db`
      SELECT * FROM categories WHERE name = ${name}
    `;
    if (existingCategory.length > 0) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const uploadResponse = await cloudinary.uploader.upload(image_url);
    const imageUrl = uploadResponse.secure_url;

    const result = await db`
      INSERT INTO categories (name, image_url)
      VALUES (${name}, ${imageUrl})
      RETURNING *;
    `;

    res.status(201).json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error inserting category:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT update category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await db`SELECT * FROM categories WHERE id = ${id}`;
    if (category.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    const result = await db`
      UPDATE categories SET name = ${name} WHERE id = ${id}
      RETURNING *;
    `;
    res.json({ success: true, data: result[0] });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE category (with optional Cloudinary deletion)
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await db`SELECT * FROM categories WHERE id = ${id}`;
    if (category.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    // OPTIONAL: Delete Cloudinary image
    // if (category[0].image_url) {
    //   const publicId = category[0].image_url.split('/').pop().split('.')[0];
    //   await cloudinary.uploader.destroy(publicId);
    // }

    await db`DELETE FROM categories WHERE id = ${id}`;
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET products by category ID
exports.getProductsByCategoryId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db`
      SELECT * FROM products WHERE category_id = ${id}
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: "No products found for this category" });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error getProductsByCategoryId:", error);
    res.status(500).json({ error: "Server error retrieving products" });
  }
};
