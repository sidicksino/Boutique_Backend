const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const profileController = require('../controllers/profileController');

/**
 * @swagger
 * /api/me/getUser:
 *   get:
 *     summary: Get current user profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone_number:
 *                   type: string
 *                 name:
 *                   type: string
 *                 profile_photo:
 *                   type: string
 *                 role:
 *                   type: string
 *                 preferences:
 *                   type: object
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/getUser',authenticateToken, profileController.getUser);

/**
 * @swagger
 * /api/me/updateProfile:
 *   put:
 *     summary: Update user profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               profile_photo:
 *                 type: string
 *               preferences:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Server error
 */
router.put('/updateProfile',authenticateToken, profileController.updateProfile);

module.exports = router;