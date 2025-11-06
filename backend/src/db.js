const { Pool } = require("pg");
require("dotenv").config();

const sslConfig = {
  rejectUnauthorized: true,
  ca: process.env.CA_CERT, // ← This is your full PEM string from Render env
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? sslConfig : { rejectUnauthorized: false },
});

pool.connect()
  .then(() => console.log("Connected to Aiven PostgreSQL"))
  .catch((err) => console.error("Database connection error:", err));

module.exports = pool;