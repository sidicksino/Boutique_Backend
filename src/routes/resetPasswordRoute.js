const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/resetPasswordController');
const authenticateToken = require('../middleware/auth');

router.post('/requestReset', resetPasswordController.requestReset);
router.post('/verifyCode', resetPasswordController.verifyCode);
router.post('/resetPassword', resetPasswordController.resetPassword);
router.post('/changePassword', authenticateToken, resetPasswordController.changePassword);

module.exports = router;