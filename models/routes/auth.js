const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Your user model
const { body, validationResult } = require('express-validator');

const router = express.Router();

// User Sign-Up
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, username, password } = req.body;

      // Check if user exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'User already exists' });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      user = new User({ email, username, password: hashedPassword });
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ message: 'User registered successfully', token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
