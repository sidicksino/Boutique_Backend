const {db} = require('../db');

exports.getUser = async (req, res) => {
    const userId = req.user.user_id;

    try {
        const results = await db`
        SELECT user_id, email, phone_number, name, profile_photo, role, preferences 
        FROM users 
        WHERE user_id = ${userId}
      `;

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
