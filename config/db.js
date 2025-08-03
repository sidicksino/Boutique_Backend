const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
dotenv.config();

// Crée une instance de connexion avec Neon
const db = neon(process.env.DATABASE_URL);

async function initDB() {
  try {
    await db`CREATE TABLE IF NOT EXISTS users (
      user_id CHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone_number VARCHAR(20),
      name VARCHAR(100),
      profile_photo VARCHAR(255),
      role VARCHAR(10) DEFAULT 'Client',
      password VARCHAR(255) NOT NULL,
      preferences JSON DEFAULT NULL
    )`;

    console.log("Database initialized successfully");
  } catch (error) {
    console.error(" Error initializing DB:", error);
    process.exit(1);
  }
}

// Appel direct si ce fichier est exécuté seul
if (require.main === module) {
  initDB();
}

// Exporte la connexion DB pour les autres fichiers
module.exports = { db };
