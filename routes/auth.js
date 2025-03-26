const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
const SECRET = process.env.JWT_SECRET;

// POST /auth/register
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
        [username, hash, email]
      );
      res.sendStatus(201);
    } catch (err) {
      if (err.code === '23505') {
        // Unique violation
        return res.status(409).json({ error: 'Username already exists' });
      }
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  });
  

// POST /auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', verifyToken, (req, res) => {
  res.json({
    message: 'Authenticated user info',
    user: req.user
  });
});


module.exports = router;
