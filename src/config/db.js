const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
dotenv.config();

// Crée une instance de connexion avec Neon
const db = neon(process.env.DATABASE_URL);

async function initDB() {
  try {
    await db`CREATE TABLE IF NOT EXISTS users (
      user_id CHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      phone_number VARCHAR(20) UNIQUE,
      name VARCHAR(100),
      profile_photo VARCHAR(255),
      role VARCHAR(10) DEFAULT 'Client',
      password VARCHAR(255) NOT NULL,
      preferences JSON DEFAULT NULL,
      provider VARCHAR(20)
    )`;

    await db`CREATE TABLE IF NOT EXISTS categories (
      category_id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      image_url VARCHAR(255)
    )`;

    await db`CREATE TABLE IF NOT EXISTS products (
      product_id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      discount_percentage INT DEFAULT 0,
      image_url VARCHAR(255),
      in_stock BOOLEAN DEFAULT TRUE,
      is_favorite BOOLEAN DEFAULT FALSE,
      category_id INT REFERENCES categories(category_id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    await db`CREATE TABLE IF NOT EXISTS favorites (
      favorite_id SERIAL PRIMARY KEY,
      user_id CHAR(36) REFERENCES users(user_id) ON DELETE CASCADE,
      product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id)
    )`;  
    
    // TABLE password_resets
    await db`CREATE TABLE IF NOT EXISTS password_resets (
      id SERIAL PRIMARY KEY,
      user_id CHAR(36) REFERENCES users(user_id) ON DELETE CASCADE,
      code VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`; 

    console.log(" Database initialized successfully");
  } catch (error) {
    console.error(" Error initializing DB:", error);
    process.exit(1);
  }
}

// Exporte la connexion DB pour les autres fichiers
module.exports = { db , initDB};
