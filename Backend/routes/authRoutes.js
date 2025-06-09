const express = require('express');
const router = express.Router();
//Importing the controller functions for register and login from controllers/auth.js.
const authController = require('../controllers/authController');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

module.exports = router; //Exports the router object so it can be used in index.js: [  app.use('/api/auth', authRoutes);   ]
