const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

router.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: { api_key: TMDB_API_KEY, query },
    });
    res.json(response.data.results);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

router.get('/:movieId', async (req, res) => {
  const { movieId } = req.params;
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: { api_key: TMDB_API_KEY, append_to_response: 'videos' },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

module.exports = router;