const User = require('../models/userModel');
const bcrypt = require('bcryptjs');       //for hashing password
const jwt = require('jsonwebtoken');      //creates token for new user login
const { sendWelcomeEmail } = require('../services/emailService');

// REGISTER CONTROLLER - Handles user registration
exports.register = async (req, res) => {
  //takes username from the request made
  const { uname, email, password } = req.body;

  try 
  {
    // Check if username or email already exists in MongoDB
    const userExists = await User.findOne({
      $or: [{ uname }, { email }]
    });

    if (userExists) {
      return res.status(400).json({ msg: 'Username or Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = new User({
      uname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    await sendWelcomeEmail(email, uname);

    res.status(201).json({ msg: 'User registered successfully and welcome email sent' });
  } 
  catch (err) 
  {
    console.error('Registration Error:', err.message);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

// LOGIN CONTROLLER - Handles user login
exports.login = async (req, res) => {
  const { uname, password } = req.body;

  try 
  {
    // Check if user exists by username
    const user = await User.findOne({ uname });

    if (!user) 
    {
      return res.status(400).json({ msg: 'Invalid username' });
    }

    // Compare plain password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) 
    {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        uname: user.uname,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    //Send back a response with token and user details
    res.json({
      msg: 'Login successful',
      token,
      user: {
        uname: user.uname,
        email: user.email,
        id: user._id
      }
    });
  } 
  catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ msg: 'Server error during login' });
  }
};
