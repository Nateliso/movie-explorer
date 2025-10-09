const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: process.env.CA_CERT,
  },
});

pool.on('connect', () => {
  console.log('✅ Connected securely to Aiven PostgreSQL');
});

module.exports = pool;