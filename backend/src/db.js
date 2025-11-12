const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? {
        rejectUnauthorized: true,
        ca: Buffer.from(process.env.CA_CERT), // ← CRITICAL: Convert to Buffer
      }
    : { rejectUnauthorized: false },
});

pool.connect()
  .then(() => console.log("Connected to Aiven PostgreSQL"))
  .catch((err) => console.error("Database connection error:", err));

module.exports = pool;