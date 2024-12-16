const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// In-memory "database" for storing tasks
let tasks = [
  { id: 1, task: 'Write code', completed: false },
  { id: 2, task: 'Test API', completed: true }
];

// Helper function to refresh IDs
const refreshTaskIds = () => {
  tasks = tasks.map((task, index) => ({ ...task, id: index + 1 }));
};

// GET /tasks - Fetch all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  const { task, completed } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }
  const newTask = {
    id: tasks.length + 1,
    task,
    completed: completed || false
  };
  tasks.push(newTask);
  refreshTaskIds(); // Ensure IDs are accurate
  res.status(201).json(newTask);
});

// PUT /tasks/:id - Update a task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;

  const taskToUpdate = tasks.find((t) => t.id === parseInt(id));
  if (!taskToUpdate) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (task) taskToUpdate.task = task;
  if (typeof completed === 'boolean') taskToUpdate.completed = completed;

  res.status(200).json(taskToUpdate);
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex((t) => t.id === parseInt(id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  refreshTaskIds(); // Ensure IDs are accurate
  res.status(200).json({ message: 'Task deleted' });
});

// Start the server
app.listen(port, () => {
  console.log(`To-Do API running at http://localhost:${port}`);
});
