router.post('/upload', authenticateToken, async (req, res) => {
  try {
    console.log("Body received length:", req.body?.profile_photo?.length);

    const userId = req.user.user_id;
    const { profile_photo } = req.body;
    if (!profile_photo) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadResponse = await cloudinary.uploader.upload(profile_photo, {
      folder: "profile_photos",
    });

    const imageUrl = uploadResponse.secure_url;

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
