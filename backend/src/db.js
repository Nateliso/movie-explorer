const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.process.env.CA_CERT,
    rejectUnauthorized: true,
  },
});

pool.connect()
  .then(() => console.log('Connected to Aiven database'))
  .catch(err => console.error('Database connection error:', err));

module.exports = pool;