const { db } = require('../config/db');

//  GET all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await db`SELECT * FROM categories`;
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

//  GET category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  const result = await db`SELECT * FROM categories WHERE id = ${id}`;
  if (result.length === 0) return res.status(404).json({ error: "Category not found" });
  res.json(result[0]);
};

// POST create category
exports.createCategory = async (req, res) => {
  const { name, image_url } = req.body;
  try {
    const result = await db`
      INSERT INTO categories (name, image_url)
      VALUES (${name}, ${image_url})
      RETURNING *;
    `;
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error inserting category:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT update category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await db`
    UPDATE categories SET name = ${name} WHERE id = ${id}
    RETURNING *`;
  res.json(result[0]);
};

// DELETE category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  await db`DELETE FROM categories WHERE id = ${id}`;
  res.json({ message: "Category deleted" });
};
