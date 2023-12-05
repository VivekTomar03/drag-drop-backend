// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/authMiddleware');
const Task = require('../models/Task');

// Create task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, project, assignedTo, labels } = req.body;
    const createdBy = req.user._id;

    const task = new Task({ title, description, project, assignedTo, createdBy, labels });
    await task.save();

    res.status(201).json({ message: 'Task created successfully.', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
});


// Get tasks for a project
router.get('/project/:projectId', authMiddleware, async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const tasks = await Task.find({ project: projectId })
        .populate('assignedTo createdBy project') // Add project population
        .exec();
  
      res.json({ tasks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  });
  

// ... (other routes)

module.exports = router;
