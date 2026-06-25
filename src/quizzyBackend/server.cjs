const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'my_super_secret_key_123';

// Mock Databases (saved in-memory)
const users = []; // Stores registered users

let quizzes = [
  { id: 1, title: 'Introduction to Biology', questions: 15, completions: 28, rate: 75 },
  { id: 2, title: 'Introduction to Biology', questions: 15, completions: 28, rate: 40 },
  { id: 3, title: 'Introduction to Biology', questions: 15, completions: 28, rate: 90 },
];

let events = [
  { id: 1, title: 'Science Mid-term Quiz', time: '2026-06-24, 15:30', participants: '32 participants', isLive: false, date: '2026-06-24', clockTime: '15:30', description: 'A mid-term science quiz covering Biology and Physics topics.' },
  { id: 2, title: 'Mathematics Weekly Test', time: '2026-06-25, 10:00', participants: '28 participants', isLive: false, date: '2026-06-25', clockTime: '10:00', description: 'A weekly mathematics test covering calculus and algebra.' },
  { id: 3, title: 'History Final Exam', time: '2026-06-26, 09:00', participants: '45 participants', isLive: false, date: '2026-06-26', clockTime: '09:00', description: 'The final exam for the world history course.' },
];

// ----------------------------------------------------
// 1. AUTHENTICATION: Sign Up Endpoint
// ----------------------------------------------------
app.post('/api/signup', (req, res) => {
  const { fullName, username, email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = { fullName, username, email, password, role };
  users.push(newUser);

  res.status(201).json({ message: 'User created successfully!', user: { email, role } });
});

// ----------------------------------------------------
// 2. AUTHENTICATION: Sign In Endpoint
// ----------------------------------------------------
app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { email: user.email, username: user.username || user.fullName, role: user.role }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );

  res.status(200).json({
    message: 'Login successful',
    token: token,
    role: user.role
  });
});

// ----------------------------------------------------
// 3. AUTHORIZATION: Fetch Dashboard Endpoint
// ----------------------------------------------------
// Inside server.cjs:
app.get('/api/teacher/dashboard-data', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No authorization token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // UPDATE THIS: Allow both teachers and students to view dashboard stats
    if (decoded.role !== 'teacher' && decoded.role !== 'student') {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const stats = [
      { label: 'Total Quizzes', value: quizzes.length + 2540, change: '+12.5%', color: '#FF7AB6' },
      { label: 'Active Events', value: events.length, change: '+12.5%', color: '#FFB86B' },
      { label: 'Students', value: '2,543', change: '+12.5%', color: '#FFD166' },
      { label: 'Avg. Completion', value: '2,543', change: '-12.5%', color: '#FF7AB6', isNegative: true },
    ];

    res.json({
      teacherName: decoded.username || 'User',
      quizzesList: quizzes,
      eventsList: events,
      stats: stats
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired session token.' });
  }
});

// ----------------------------------------------------
// 4. AUTHORIZATION: Edit Event Endpoint (PUT)
// ----------------------------------------------------
app.put('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, date, clockTime, description } = req.body;

  const eventIndex = events.findIndex(e => e.id === id);
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }

  events[eventIndex] = {
    ...events[eventIndex],
    title,
    date,
    clockTime,
    description,
    time: `${date}, ${clockTime}`
  };

  res.json({ message: 'Event updated successfully!', event: events[eventIndex] });
});

// ----------------------------------------------------
// 5. AUTHORIZATION: Delete Event Endpoint (DELETE)
// ----------------------------------------------------
app.delete('/api/events/:id', (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter(e => e.id !== id);
  res.json({ message: 'Event deleted successfully!' });
});

app.listen(5000, () => console.log('API server online at http://localhost:5000'));