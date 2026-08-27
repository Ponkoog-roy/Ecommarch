const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db/postgres');

const { requireAuth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );
}

/* =========================
   Register
========================= */

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'name, email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters'
      });
    }

    const normalizedEmail = email.toLowerCase();

    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: 'An account with that email already exists'
      });
    }

    const password_hash = bcrypt.hashSync(password, 10);

    const insertUser = await db.query(
      `
      INSERT INTO users
      (
        name,
        email,
        phone,
        password_hash
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      RETURNING
        id,
        name,
        email,
        phone,
        role
      `,
      [
        name,
        normalizedEmail,
        phone || null,
        password_hash
      ]
    );

    const user = insertUser.rows[0];

    await db.query(
      `
      INSERT INTO carts (user_id)
      VALUES ($1)
      `,
      [user.id]
    );

    const token = signToken(user);

    res.status(201).json({
      user,
      token
    });
  } catch (err) {
    next(err);
  }
});

/* =========================
   Login
========================= */

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        error: 'email and password are required'
      });
    }

    const result = await db.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const row = result.rows[0];

    const validPassword =
      bcrypt.compareSync(password, row.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const user = {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: row.role
    };

    const token = signToken(user);

    res.json({
      user,
      token
    });
  } catch (err) {
    next(err);
  }
});

/* =========================
   Logout
========================= */

router.post('/logout', (req, res) => {
  res.json({
    ok: true
  });
});

/* =========================
   Profile
========================= */

router.get('/profile', requireAuth, async (req, res, next) => {
  try {
    const result = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        role,
        created_at
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;