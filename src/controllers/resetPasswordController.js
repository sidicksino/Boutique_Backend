const { db } = require('../config/db');
const generateOTP = require('../utils/generateOTP');
const sendOTP = require('../utils/sendOTP');
const bcrypt = require('bcrypt');

// Request OTP code
exports.requestReset = async (req, res) => {
  const { emailOrPhone } = req.body;

  try {
    const results = await db`
      SELECT user_id, email FROM users WHERE email = ${emailOrPhone} OR phone_number = ${emailOrPhone}
    `;

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];
    const code = generateOTP();
    const expiration = new Date(Date.now() + 10 * 60000); // 10 minutes

    await db`
      INSERT INTO password_resets (user_id, code, expires_at)
      VALUES (${user.user_id}, ${code}, ${expiration})
    `;

    await sendOTP(emailOrPhone, code);

    const isEmail = emailOrPhone.includes('@');
    res.json({
      message: `Code sent by ${isEmail ? 'email' : 'SMS'}`
    });
  } catch (err) {
    console.error('RequestReset Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Verify the code
exports.verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    const results = await db`
      SELECT * FROM password_resets WHERE code = ${code} AND expires_at > NOW()
    `;

    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    res.json({ message: 'Code valid', user_id: results[0].user_id });
  } catch (err) {
    console.error('VerifyCode Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reset the password
exports.resetPassword = async (req, res) => {
  const { user_id, newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Both fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);

    await db`
      UPDATE users SET password = ${hashed} WHERE user_id = ${user_id}
    `;

    await db`
      DELETE FROM password_resets WHERE user_id = ${user_id}
    `;

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('ResetPassword Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
