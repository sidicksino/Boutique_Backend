const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const { db } = require('./db');
const userRoutes = require('./routes/userRoutes');
const meRoutes = require('./routes/profileRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Simple route
app.get('/dashboard', (req, res) => {
  res.send("Welcome to Boutique Sino Bour");
});

// User routes
app.use('/api/user', userRoutes);
app.use('/api/me', meRoutes);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});