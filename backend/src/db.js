const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false, // ignore Aiven’s self-signed cert
  },
});

pool.on('connect', () => {
  console.log('Connected to Aiven PostgreSQL');
});

module.exports = pool;