const { Pool } = require('pg');

// Create a pool for PostgreSQL connection
const pool = new Pool({
  host: 'localhost',      // PostgreSQL host (localhost for local)
  port: 5432,             // Default PostgreSQL port
  database: 'userdb', // Replace with your database name
  user: 'postgres',  // Replace with your PostgreSQL username
  password: 'root', // Replace with your PostgreSQL password
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;