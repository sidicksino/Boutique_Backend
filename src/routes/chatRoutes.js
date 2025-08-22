// routes/chatRoutes.js

const express = require("express");
const { getChatHistory } = require("../controllers/chatController");
const router = express.Router();

// GET: Récupérer l'historique du chat d'un utilisateur
// Exemple : GET /api/chat/history/123e4567-e89b-12d3-a456-426614174000
router.get("/history/:userId", getChatHistory);

module.exports = router;