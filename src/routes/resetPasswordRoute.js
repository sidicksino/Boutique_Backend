const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/resetPasswordController');

router.post('/requestReset', resetPasswordController.requestReset);
router.post('/verifyCode', resetPasswordController.verifyCode);
router.post('/resetPassword', resetPasswordController.resetPassword);

module.exports = router;