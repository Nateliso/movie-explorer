const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const caPath = path.resolve(__dirname, './certs/ca.pem'); // adjust filename if different

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync(caPath).toString(),
    rejectUnauthorized: true,
  },
});

pool.connect()
  .then(() => console.log('Connected to Aiven database'))
  .catch(err => console.error('Database connection error:', err));

module.exports = pool;