const express = require('express');
const cloudinary = require('../config/cloudinary');
const { db } = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router(); // ⚡ il manquait ça

router.post('/upload', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { profile_photo } = req.body;

    if (!profile_photo) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // upload sur Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profile_photo, {
      folder: "profile_photos",
    });

    const imageUrl = uploadResponse.secure_url;

    // update en DB
    await db`
      UPDATE users 
      SET profile_photo = ${imageUrl}
      WHERE user_id = ${userId}
    `;

    res.status(200).json({ url: imageUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
