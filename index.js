// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authMiddleware = require('./auth/authMiddleware');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const taskRoutes = require('./routes/taskRoutes'); // Add this line
const projectRoutes = require('./routes/projectRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
mongoose.connect(process.env.MongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Signup
app.post('/api/signup', async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
  
      // Check if the username or email is already taken
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ error: 'Username or email is already taken. Please choose different credentials.' });
      }
  
      // If the username and email are not taken, create a new user
      const user = new User({ username, email, password, role });
      await user.save();
  
      res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error.' });
    }
  });

// Signin
app.post('/api/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    // If the user is not found or the password is incorrect, return an error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // If the username and password are correct, issue a JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' });

    // Send the token in the response
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
});

// Example Protected Route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route.', user: req.user });
});

// Use task and project routes
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);

app.listen(PORT, async () => {
  try {
    await db;
    console.log('Server is connected to the database.');
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
