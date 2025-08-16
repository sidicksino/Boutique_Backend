const { db } = require('../config/db');
const cloudinary = require('../config/cloudinary');

//  GET all products
exports.getProducts = async (req, res) => {
  try {
    const products = await db`SELECT * FROM products`;
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET all products with category name + total count + count by category
exports.getAllProductsWithCategoryName = async (req, res) => {
  try {
    // 1. Liste des produits avec nom de catégorie
    const products = await db`
      SELECT 
        p.product_id,
        p.name,
        p.price,
        p.description,
        p.image_url,
        c.category_id,
        c.name AS category_name
      FROM products p
      JOIN categories c 
        ON p.category_id = c.category_id
    `;

    // 2. Total produits
    const totalProducts = await db`
      SELECT COUNT(*)::int AS total FROM products
    `;

    // 3. Total par catégorie (inclut les catégories vides)
    const productsByCategory = await db`
      SELECT 
        c.name as category_name, 
        COUNT(p.product_id)::int as total
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.category_id
      GROUP BY c.name
      ORDER BY c.name;
    `;

    // 4. Réponse JSON
    res.json({
      total: totalProducts[0].total,
      byCategory: productsByCategory,
      products
    });
  } catch (err) {
    console.error("Error fetching products with categories:", err);
    res.status(500).json({ error: "Server error" });
  }
};


//  GET product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await db`SELECT * FROM products WHERE id = ${id}`;
  if (product.length === 0) return res.status(404).json({ error: "Product not found" });
  res.json(product[0]);
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount_percentage = 0,
      image_url,
      in_stock = true,
      is_favorite = false,
      category_id
    } = req.body;

    if (!name || !description || !price || !image_url || !category_id) {
      return res.status(400).json({ error: "Name, price, image URL, and category ID are required" });
    }

    // Nettoyer et convertir le prix
    const productPrice = price.toString().replace(/[\s,]/g, "");
    productPrice = parseInt(productPrice, 10);

    if (isNaN(productPrice)) {
      return res.status(400).json({ error: "Price must be a valid number" });
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image_url);
    const uploadedImageUrl = uploadResponse.secure_url;

    // Insert product
    const result = await db`
        INSERT INTO products
          (name, description, price, discount_percentage, image_url, in_stock, is_favorite, category_id)
        VALUES
          (${name}, ${description}, ${productPrice}, ${discount_percentage}, ${uploadedImageUrl}, ${in_stock}, ${is_favorite}, ${category_id})
        RETURNING *;
      `;

    res.status(201).json(result[0]);

  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT update product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image_url, description, category } = req.body;
  const result = await db`
    UPDATE products SET 
      name = ${name},
      price = ${price},
      image_url = ${image_url},
      description = ${description},
      category = ${category}
    WHERE id = ${id}
    RETURNING *`;
  res.json(result[0]);
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Vérifier si le produit existe
    const product = await db`SELECT * FROM products WHERE id = ${id}`;
    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Supprimer l'image Cloudinary si elle existe
    if (product[0].image_url) {
      try {
        const parts = product[0].image_url.split("/upload/");
        if (parts.length > 1) {
          const publicIdWithExtension = parts[1]; // ex: v1723803091/shop/product_abc123.jpg
          const publicId = publicIdWithExtension.split(".")[0]; // enlève l’extension
          const result = await cloudinary.uploader.destroy(publicId);
          console.log("Cloudinary delete result:", result);
        }
      } catch (err) {
        console.error("Cloudinary delete error:", err.message);
      }
    }

    // Supprimer le produit dans la DB
    await db`DELETE FROM products WHERE id = ${id}`;

    res.json({ success: true, message: "Product deleted" });

  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Server error" });
  }
};

