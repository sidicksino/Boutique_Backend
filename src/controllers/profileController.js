const { db } = require('../config/db');

exports.getUser = async (req, res) => {
    const userId = req.user.user_id;

    try {
        const results = await db`
        SELECT user_id, email, phone_number, name, profile_photo, role, preferences, provider
        FROM users 
        WHERE user_id = ${userId}`;

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(results[0]);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.user.user_id;
    const { name, profile_photo, preferences } = req.body;

    try {
        const preferencesStr = preferences ? JSON.stringify(preferences) : null;

        await db`
        UPDATE users 
        SET 
          name = ${name}, 
          profile_photo = ${profile_photo}, 
          preferences = ${preferencesStr}
        WHERE user_id = ${userId}
      `;

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller: updateName
exports.updateName = async (req, res) => {
    const userId = req.user.user_id;
    const { name } = req.body;

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'A valid name is required' });
    }

    const trimmedName = name.trim();
    if (trimmedName.length > 50) {
        return res.status(400).json({ error: 'Name cannot exceed 50 characters' });
    }

    try {
        // Perform update and get result
        const result = await db`
        UPDATE users 
        SET name = ${trimmedName} 
        WHERE user_id = ${userId}
        RETURNING user_id
      `;

        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ message: 'Name updated successfully' });
    } catch (err) {
        console.error('Error updating name:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};



exports.updateEmailPhone = async (req, res) => {
    const userId = req.user.user_id;
    const { email, phone_number } = req.body;
  
    try {
      // Récupérer l'utilisateur
      const userResult = await db`
        SELECT provider, email, phone_number 
        FROM users 
        WHERE user_id = ${userId}
      `;
  
      if (userResult.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const user = userResult[0];
      const updates = [];
      const updateData = {};
  
      // 1. Mettre à jour email seulement si provider === 'phone'
      if (email !== undefined && user.provider === 'phone') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email.trim())) {
          return res.status(400).json({ error: 'Please provide a valid email' });
        }
  
        // Vérifier si email déjà utilisé
        const existing = await db`
          SELECT user_id FROM users WHERE email = ${email.trim()} AND user_id != ${userId}
        `;
        if (existing.length > 0) {
          return res.status(409).json({ error: 'Email already in use' });
        }
  
        updateData.email = email.trim();
        updates.push(db`email = ${updateData.email}`);
      }
  
      // 2. Mettre à jour phone_number seulement si provider === 'email'
      if (phone_number !== undefined && user.provider === 'email') {
        const cleanPhone = phone_number.replace(/\s/g, '');
        const phoneRegex = /^[0-9]{8,15}$/;
        if (!phoneRegex.test(cleanPhone)) {
          return res.status(400).json({ error: 'Phone must be 8–15 digits' });
        }
  
        // Vérifier si numéro déjà utilisé
        const existing = await db`
          SELECT user_id FROM users WHERE phone_number = ${cleanPhone} AND user_id != ${userId}
        `;
        if (existing.length > 0) {
          return res.status(409).json({ error: 'Phone number already in use' });
        }
  
        updateData.phone_number = cleanPhone;
        updates.push(db`phone_number = ${updateData.phone_number}`);
      }
  
      // Aucune mise à jour autorisée
      if (updates.length === 0) {
        return res.status(400).json({
          error: user.provider === 'email'
            ? 'You cannot update your email'
            : 'You cannot update your phone number',
        });
      }
  
      // Appliquer la mise à jour
      const result = await db`
        UPDATE users
        SET ${db(updates, ' , ')}
        WHERE user_id = ${userId}
        RETURNING email, phone_number
      `;
  
      if (result.length === 0) {
        return res.status(500).json({ error: 'Update failed' });
      }
  
      return res.json({
        message: 'Contact info updated successfully',
        user: result[0],
      });
    } catch (err) {
      console.error('Error updating contact:', err);
      return res.status(500).json({ error: 'Server error' });
    }
};