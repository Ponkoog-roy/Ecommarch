const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', (req, res) => {
  const { name, email, phone, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'An account with that email already exists' });

  const password_hash = bcrypt.hashSync(password, 10);
  const info = db.prepare(
    'INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)'
  ).run(name, email.toLowerCase(), phone || null, password_hash);

  db.prepare('INSERT INTO carts (user_id) VALUES (?)').run(info.lastInsertRowid);

  const user = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(info.lastInsertRowid);
  const token = signToken(user);
  res.status(201).json({ user, token });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const user = { id: row.id, name: row.name, email: row.email, phone: row.phone, role: row.role };
  const token = signToken(user);
  res.json({ user, token });
});

router.post('/logout', (req, res) => {
  // Stateless JWT: logout is handled client-side by discarding the token.
  res.json({ ok: true });
});

router.get('/profile', requireAuth, (req, res) => {
  const user = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

module.exports = router;
