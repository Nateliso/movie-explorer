const express = require('express');
const pool = require('../db');
const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, movie_id, title, rating FROM watchlists WHERE user_id = $1', [req.session.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  const { movie_id, title } = req.body;
  if (!movie_id || !title) {
    return res.status(400).json({ error: 'Missing movie_id or title' });
  }
  try {
    const exists = await pool.query(
      'SELECT * FROM watchlists WHERE user_id = $1 AND movie_id = $2',
      [req.session.user.id, movie_id]
    );
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'Movie already in watchlist' });
    }
    const result = await pool.query(
      'INSERT INTO watchlists (user_id, movie_id, title) VALUES ($1, $2, $3) RETURNING id, movie_id, title, rating',
      [req.session.user.id, movie_id, title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:movie_id', isAuthenticated, async (req, res) => {
  const { movie_id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM watchlists WHERE user_id = $1 AND movie_id = $2 RETURNING *',
      [req.session.user.id, movie_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Movie not found in watchlist' });
    }
    res.json({ message: 'Movie removed from watchlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:movie_id/rating', isAuthenticated, async (req, res) => {
  const { movie_id } = req.params;
  const { rating } = req.body;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  try {
    const result = await pool.query(
      'UPDATE watchlists SET rating = $1 WHERE user_id = $2 AND movie_id = $3 RETURNING id, movie_id, rating',
      [rating, req.session.user.id, movie_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Movie not found in watchlist' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;