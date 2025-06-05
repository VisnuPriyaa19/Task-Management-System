const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER CONTROLLER
exports.register = async (req, res) => {
  const { uname, email, password } = req.body;

  try {
    // Check if username or email already exists
    const userExists = await User.findOne({
      $or: [{ uname }, { email }]
    });

    if (userExists) {
      return res.status(400).json({ msg: 'Username or Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      uname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

// LOGIN CONTROLLER
exports.login = async (req, res) => {
  const { uname, password } = req.body;

  try {
    // Check if user exists by username
    const user = await User.findOne({ uname });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid username' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      msg: 'Login successful',
      token,
      user: {
        uname: user.uname,
        email: user.email,
        id: user._id
      }
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ msg: 'Server error during login' });
  }
};
