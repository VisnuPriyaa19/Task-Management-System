const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// 🔹 Create a new project
// Endpoint: POST /api/projects
router.post('/', projectController.createProject);

// 🔹 Get all projects by a user
// Endpoint: GET /api/projects/user/:userId
router.get('/user/:userId', projectController.getProjectsByUser);

// 🔹 Get a single project by its ID
// Endpoint: GET /api/projects/:projectId
router.get('/:projectId', projectController.getProjectById);

// 🔹 Update a project by its ID
// Endpoint: PUT /api/projects/:projectId
router.put('/:projectId', projectController.updateProject);

// 🔹 Delete a project by its ID
// Endpoint: DELETE /api/projects/:projectId
router.delete('/:projectId', projectController.deleteProject);

module.exports = router;
