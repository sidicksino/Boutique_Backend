// controllers/favoritesController.js
const { db } = require('../config/db');

exports.addToFavorites = async (req, res) => {
  const user_id = req.user.user_id;
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    await db`
      INSERT INTO favorites (user_id, product_id)
      VALUES (${user_id}, ${product_id})
      ON CONFLICT (user_id, product_id) DO NOTHING
    `;
    res.status(201).json({ message: "Added to favorites" });
  } catch (err) {
    console.error("Add Favorite Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.removeFromFavorites = async (req, res) => {
  const user_id = req.user.user_id;
  const product_id = parseInt(req.params.product_id);

  try {
    await db`
      DELETE FROM favorites
      WHERE user_id = ${user_id} AND product_id = ${product_id}
    `;
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    console.error("Remove Favorite Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getFavorites = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const favorites = await db`
      SELECT p.*
      FROM products p
      JOIN favorites f ON p.product_id = f.product_id
      WHERE f.user_id = ${user_id}
    `;
    res.json(favorites);
  } catch (err) {
    console.error("Get Favorites Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
