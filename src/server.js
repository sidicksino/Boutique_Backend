const express = require('express');
const dotenv = require('dotenv');
const initDB = require("./config/db").initDB; 
dotenv.config();
const job = require("./config/cron");
const productCategorieRoutes = require('./routes/categoryRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');

const { db } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const meRoutes = require('./routes/profileRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // <-- importer
const resetPasswordRoute = require('./routes/resetPasswordRoute'); // <-- importer
const path = require('path');

if (process.env.NODE_ENV === "production") job.start();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// pour servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Simple route
app.get('/dashboard', (req, res) => {
  res.send("Welcome to Boutique Sino Bour");
});

// User routes
app.use('/api/user', userRoutes);
app.use('/api/me', meRoutes);

// reset password route
app.use('/api/resetPassword', resetPasswordRoute);

// Produit routes and categories routes
app.use('/api', productRoutes);
app.use('/api', productCategorieRoutes)

// favorites routes
app.use('/api', favoritesRoutes);

// uplaod image route
app.use('/api', uploadRoutes);

initDB();
app.listen(port, () => {
  console.log(` Server is running on port ${port}`);
});