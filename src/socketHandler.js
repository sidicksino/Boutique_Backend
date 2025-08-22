// socketHandler.js
module.exports = function (io, db) {
    io.on("connection", (socket) => {
      console.log(" Client connecté:", socket.id);
  
      socket.on("join_user", async ({ userId }) => {
        socket.join(`user_${userId}`);
        console.log(` User ${userId} rejoint room`);
  
        try {
          const history = await db`
            SELECT * FROM chat_messages 
            WHERE user_id = ${userId}
            ORDER BY sent_at ASC
          `;
          socket.emit("chat_history", history);
        } catch (err) {
          console.error("Erreur:", err);
        }
      });
  
      socket.on("join_admin", async ({ userId }) => {
        const user = await db`
          SELECT role FROM users WHERE user_id = ${userId}
        `;
        if (user[0]?.role !== "admin") {
          socket.emit("error", "Accès refusé");
          socket.disconnect();
          return;
        }
        socket.join("admin_room");
        console.log(" Admin connecté");
      });
  
      socket.on("send_message", async ({ userId, message }) => {
        if (!message.trim()) return;
  
        try {
          const result = await db`
            INSERT INTO chat_messages (user_id, sender_type, message)
            VALUES (${userId}, 'user', ${message})
            RETURNING *
          `;
          const msg = result[0];
  
          io.to("admin_room").emit("new_user_message", { ...msg, user_id: userId });
          io.to(`user_${userId}`).emit("receive_message", msg);
        } catch (err) {
          console.error("Erreur envoi:", err);
        }
      });
  
      socket.on("disconnect", () => {
        console.log(" Déconnecté");
      });
    });
  };