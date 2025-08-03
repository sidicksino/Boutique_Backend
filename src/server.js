const express = require('express');
const dotenv = require('dotenv');
const initDB = require("./config/db").initDB; 
dotenv.config();
const job = require("./config/cron")

const { db } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const meRoutes = require('./routes/profileRoutes');

if (process.env.NODE_ENV === "production") job.start();

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

initDB();
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});