const { Pool } = require('pg');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for password
rl.question('Enter your PostgreSQL password for user "postgres": ', (password) => {
  // Create a pool to connect to the default 'postgres' database
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Connect to default database
    user: 'postgres',
    password: password,
  });

  // Create the database and table
  (async () => {
    try {
      console.log('Connecting to PostgreSQL...');
      await pool.query('CREATE DATABASE IF NOT EXISTS userdb;');
      console.log('Database "userdb" created or already exists.');

      // Now connect to userdb and create table
      const userdbPool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'userdb',
        user: 'postgres',
        password: password,
      });

      await userdbPool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL
        );
      `);
      console.log('Table "users" created or already exists.');

      await userdbPool.end();
      console.log('Setup complete! You can now update db.js with your password and start the server.');
    } catch (err) {
      console.error('Error during setup:', err.message);
    } finally {
      await pool.end();
      rl.close();
    }
  })();
});