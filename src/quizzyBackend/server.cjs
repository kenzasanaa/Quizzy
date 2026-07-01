require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// ============================================================
// 1. RESTRICT CORS (only your frontend can call the API)
// ============================================================
const FRONTEND_URL= {
  origin: process.env.FRONTEND_URL || 'https://quizzy-beta-kohl.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// ============================================================
// 2. SECURITY HEADERS (helmet)
// ============================================================
app.use(helmet());

app.use(express.json());

// SECURE: Read JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET is not set in .env file');
  process.exit(1);
}

const SALT_ROUNDS = 12;

// Mock Databases (saved in-memory)
const users = [];

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

// ============================================================
// 3. RATE LIMITING (brute force protection)
// ============================================================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' }
});

// Apply rate limiting to auth endpoints
app.use('/api/signin', authLimiter);
app.use('/api/signup', authLimiter);

// ============================================================
// 4. INPUT VALIDATION HELPERS
// ============================================================
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

// ============================================================
// MIDDLEWARE: Verify JWT Token
// ============================================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
}

// ============================================================
// MIDDLEWARE: Teacher Only
// ============================================================
function requireTeacher(req, res, next) {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Forbidden. Teachers only.' });
  }
  next();
}

// ----------------------------------------------------
// 1. AUTHENTICATION: Sign Up Endpoint
// ----------------------------------------------------
app.post('/api/signup', async (req, res) => {
  const { fullName, username, email, password, role } = req.body;

  // Input validation
  if (!email || !password || !role || !fullName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const cleanEmail = sanitizeString(email).toLowerCase();
  const cleanFullName = sanitizeString(fullName);
  const cleanUsername = sanitizeString(username || '');

  if (!validateEmail(cleanEmail)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }
  if (cleanFullName.length < 2) {
    return res.status(400).json({ message: 'Full name must be at least 2 characters' });
  }

  // 5. GENERIC ERROR MESSAGE (prevent user enumeration)
  const userExists = users.find(u => u.email === cleanEmail);
  if (userExists) {
    return res.status(409).json({ message: 'Registration failed' });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = {
    fullName: cleanFullName,
    username: cleanUsername,
    email: cleanEmail,
    password: hashedPassword,
    role
  };
  users.push(newUser);

  res.status(201).json({ message: 'User created successfully!' });
});

// ----------------------------------------------------
// 2. AUTHENTICATION: Sign In Endpoint
// ----------------------------------------------------
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const cleanEmail = sanitizeString(email).toLowerCase();

  if (!validateEmail(cleanEmail)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const user = users.find(u => u.email === cleanEmail);

  // 5. GENERIC ERROR MESSAGE (same for wrong email OR wrong password)
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
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
app.get('/api/teacher/dashboard-data', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'student') {
    return res.status(403).json({ message: 'Forbidden.' });
  }

  const stats = [
    { label: 'Total Quizzes', value: quizzes.length + 2540, change: '+12.5%', color: '#FF7AB6' },
    { label: 'Active Events', value: events.length, change: '+12.5%', color: '#FFB86B' },
    { label: 'Students', value: '2,543', change: '+12.5%', color: '#FFD166' },
    { label: 'Avg. Completion', value: '2,543', change: '-12.5%', color: '#FF7AB6', isNegative: true },
  ];

  res.json({
    teacherName: req.user.username || 'User',
    quizzesList: quizzes,
    eventsList: events,
    stats: stats
  });
});

// ----------------------------------------------------
// 4. AUTHORIZATION: Edit Event Endpoint (PUT)
// ----------------------------------------------------
app.put('/api/events/:id', authenticateToken, requireTeacher, (req, res) => {
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
app.delete('/api/events/:id', authenticateToken, requireTeacher, (req, res) => {
  const id = parseInt(req.params.id);
  events = events.filter(e => e.id !== id);
  res.json({ message: 'Event deleted successfully!' });
});

app.listen(5000, () => console.log('API server online at http://localhost:5000'));