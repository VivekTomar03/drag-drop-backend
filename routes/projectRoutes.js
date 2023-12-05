// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/authMiddleware');
const Project = require('../models/Project');

// Create project
router.post('/', authMiddleware, async (req, res) => {
    try {
      const { name } = req.body;
      const createdBy = req.user._id;
  
      // Check if the user has the required role (admin) to create a project
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Insufficient privileges to create a project.' });
      }
  
      const project = new Project({ name, createdBy });
      await project.save();
  
      // Update the user's projects array
      req.user.projects.push(project._id);
      await req.user.save();
  
      res.status(201).json({ message: 'Project created successfully.', project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  });
// Get projects for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ users: req.user._id });
    res.json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
});

// ... (other routes)

module.exports = router;
