const express = require('express');
const cors = require('cors');
const session = require('express-session');
const PGSession = require('connect-pg-simple')(session);
const authRoutes = require('./routes/auth');
const watchlistRoutes = require('./routes/watchlist');
const movieRoutes = require('./routes/movies');
const pool = require('./db');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://nate-movie-explorer.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(
  session({
    store: new PGSession({
      pool: pool,
      tableName: 'session',
      createTableIfMissing: true, // Auto-create table if missing
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax',
    },
  })
);


app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/movies', movieRoutes);

module.exports = app;