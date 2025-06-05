const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Route to create a project
router.post('/create', projectController.createProject);

// Route to get projects by user ID
router.get('/:userId', projectController.getProjectsByUser);

module.exports = router;
