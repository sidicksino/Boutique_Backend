const { db } = require('../config/db');

//  GET all products
exports.getProducts = async (req, res) => {
    try {
        const products = await db`SELECT * FROM products`;
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

//  GET product by ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    const product = await db`SELECT * FROM products WHERE id = ${id}`;
    if (product.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(product[0]);
};

//  POST new product
exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discount_percentage,
            image_url,
            in_stock,
            is_favorite,
            category_id
        } = req.body;

        const result = await db`
        INSERT INTO products 
          (name, description, price, discount_percentage, image_url, in_stock, is_favorite, category_id)
        VALUES 
          (${name}, ${description}, ${price}, ${discount_percentage}, ${image_url}, ${in_stock}, ${is_favorite}, ${category_id})
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

// DELETE product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    await db`DELETE FROM products WHERE id = ${id}`;
    res.json({ message: "Product deleted" });
};
