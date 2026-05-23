const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory session store for this demo
const sessions = new Map();

// Helper to read DB
const readDB = () => {
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
};

// Helper to write DB
const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

// --- AUTH ENDPOINTS ---

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

  if (user && await bcrypt.compare(password, user.password)) {
    const token = 'tok-' + Math.random().toString(36).substr(2, 9);
    sessions.set(token, user.email);

    const sessionUser = { ...user, token };
    delete sessionUser.password;
    res.json(sessionUser);
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/users', async (req, res) => {
  const token = req.headers['authorization'];
  const userEmail = sessions.get(token);

  const db = readDB();
  const currentUser = db.users.find(u => u.email === userEmail);

  if (!currentUser || currentUser.role !== 'superadmin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { userData } = req.body;

  if (db.users.find(u => u.email === userData.email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = {
    id: 'u-' + Date.now().toString().slice(-4),
    ...userData,
    password: hashedPassword,
    role: 'admin'
  };

  db.users.push(newUser);
  writeDB(db);

  const responseUser = { ...newUser };
  delete responseUser.password;
  res.status(201).json(responseUser);
});

app.get('/api/users', (req, res) => {
  const token = req.headers['authorization'];
  const userEmail = sessions.get(token);

  const db = readDB();
  const user = db.users.find(u => u.email === userEmail);

  if (!user || user.role !== 'superadmin') {
    return res.status(403).json({ message: "Access denied" });
  }

  // Return users without passwords
  const safeUsers = db.users.map(({ password, ...rest }) => rest);
  res.json(safeUsers);
});

// --- DATA ENDPOINTS ---

app.get('/api/stays', (req, res) => {
  const db = readDB();
  res.json(db.stays);
});

app.get('/api/tours', (req, res) => {
  const db = readDB();
  res.json(db.tours);
});

app.get('/api/reviews', (req, res) => {
  const db = readDB();
  res.json(db.reviews);
});

app.post('/api/listings', (req, res) => {
  const token = req.headers['authorization'];
  if (!sessions.has(token)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const item = req.body;
  const db = readDB();
  const key = item.type === 'stay' ? 'stays' : 'tours';
  db[key].unshift(item);
  writeDB(db);
  res.status(201).json(item);
});

app.post('/api/reviews', (req, res) => {
  const review = req.body;
  const db = readDB();
  db.reviews.unshift(review);

  // Update rating
  const targetStay = db.stays.find(s => s.id === review.targetId);
  const targetTour = db.tours.find(t => t.id === review.targetId);
  const target = targetStay || targetTour;

  if (target) {
    const itemReviews = db.reviews.filter(r => r.targetId === review.targetId);
    const totalRating = itemReviews.reduce((sum, r) => sum + r.rating, 0);
    target.rating = Math.round((totalRating / itemReviews.length) * 100) / 100;
    target.reviewsCount = itemReviews.length;
  }

  writeDB(db);
  res.status(201).json(review);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
