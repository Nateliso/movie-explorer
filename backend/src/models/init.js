const pool = require('../db');

const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(80) UNIQUE NOT NULL,
        password VARCHAR(120) NOT NULL
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS watchlists (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        movie_id INTEGER NOT NULL,
        title VARCHAR(200) NOT NULL,
        rating INTEGER,
        CONSTRAINT valid_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5))
      );
    `);
    console.log('Database tables created successfully');
  } catch (err) {
    console.error('Error initializing database:', err.message);
  }
};

module.exports = initDatabase;