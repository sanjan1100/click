const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the database pool

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle favicon request to prevent 404
app.get('/favicon.ico', (req, res) => res.status(204).end());

// GET /users - Fetch all users
app.get('/users', async (req, res) => {
  console.log('Fetching users...');
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    console.log('Users fetched:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /users - Insert a new user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting user:', err);
    if (err.code === '23505') { // Unique violation
      res.status(409).json({ error: 'User with this email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
