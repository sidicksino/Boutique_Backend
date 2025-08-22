// controllers/chatController.js

const { db } = require("../config/db");

// Récupérer l'historique du chat (pour l'utilisateur)
exports.getChatHistory = async (req, res) => {
  const { userId } = req.params;

  // Optionnel : vérifier que l'utilisateur connecté est bien celui qui demande
  try {
    const messages = await db`
      SELECT * FROM chat_messages 
      WHERE user_id = ${userId}
      ORDER BY sent_at ASC
    `;
    res.json(messages);
  } catch (err) {
    console.error("Erreur chargement historique:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};