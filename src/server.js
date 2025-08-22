const express = require('express');
const dotenv = require('dotenv');
const initDB = require("./config/db").initDB; 
const { Server } = require('socket.io');
const http = require('http');
dotenv.config();
const job = require("./config/cron");
const productCategorieRoutes = require('./routes/categoryRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { db } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const meRoutes = require('./routes/profileRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const resetPasswordRoute = require('./routes/resetPasswordRoute');
const path = require('path');

if (process.env.NODE_ENV === "production") job.start();

const app = express();
const port = process.env.PORT || 5000;
// socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


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

// socket
app.use('/api/chat', chatRoutes);

// === Socket.IO sera ajouté ici (prochaine étape) ===
require('./socketHandler')(io, db);

// === Démarrage du serveur ===
initDB().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => { // server.listen(), pas app.listen()
    console.log(` Serveur démarré sur le port ${PORT}`);
    console.log(` Socket.IO activé et en écoute`);
  });
});

module.exports = { app, db, io };