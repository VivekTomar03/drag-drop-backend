// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['todo', 'inProgress', 'inReview', 'completed'],
    default: 'todo',
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  labels: [{ type: String }],
  comments: [
    {
      text: { type: String, required: true },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
  ],
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
