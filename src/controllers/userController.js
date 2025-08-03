const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

exports.register = async (req, res) => {
  const { email, phone_number, password } = req.body;

  if ((!email && !phone_number) || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  if (email && phone_number) {
    return res.status(400).json({ message: 'Use either email or phone number, not both' });
  }

  try {
    let result = [];
  
    if (email) {
      result = await db`SELECT * FROM users WHERE email = ${email}`;
    } else if (phone_number) {
      result = await db`SELECT * FROM users WHERE phone_number = ${phone_number}`;
    }
  
    if (result.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = uuidv4();
  
    await db`
      INSERT INTO users (user_id, email, phone_number, role, password)
      VALUES (${user_id}, ${email || null}, ${phone_number || null}, 'Client', ${hashedPassword})`;
  
    res.status(201).json({ message: 'User created successfully' });
  
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
  
};

exports.login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ message: 'Email or phone and password required' });
  }

  try {
    const result = await db`
      SELECT * FROM users
      WHERE email = ${emailOrPhone} OR phone_number = ${emailOrPhone}`;

    if (result.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
