const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { handleErrors } = require("./handlers/errorhandler");
 
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
 
dotenv.config();
 
const app = express();
 
// Middleware
app.use(cors());
app.use(express.json());
 
// MongoDB Connection
connectDB();
 
// Use global error handling middleware
app.use(handleErrors);
 
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes); // Task routes
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});