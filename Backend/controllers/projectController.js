const Project = require('../models/projectModel');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error creating project' });
  }
};

// Get all projects for a specific user
exports.getProjectsByUser = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.params.userId });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching projects' });
  }
};
