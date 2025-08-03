const express = require('express');
const router = express.Router();
const usrerControllers = require('../controllers/userController');

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing fields or conflict
 *       500:
 *         description: Server error
 */
router.post('/register', usrerControllers.register);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login with email or phone number
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrPhone:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - emailOrPhone
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Unauthorized or invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', usrerControllers.login);

module.exports = router;