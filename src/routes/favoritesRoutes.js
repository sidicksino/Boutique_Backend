// routes/favoritesRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} = require('../controllers/favoritesController');

// Routes sécurisées par JWT
router.post('/favorites', authenticateToken, addToFavorites);
router.delete('/favorites/:product_id', authenticateToken, removeFromFavorites);
router.get('/favorites', authenticateToken, getFavorites);

module.exports = router;
