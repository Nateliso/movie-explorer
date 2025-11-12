const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const caPath = path.join(__dirname, "certs", "ca.pem");

const sslConfig = isProduction
  ? {
      rejectUnauthorized: true,
      ca: fs.readFileSync(caPath).toString(),
    }
  : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});

pool.connect()
  .then(() => console.log("Connected to Aiven PostgreSQL"))
  .catch((err) => console.error("Database connection error:", err));

module.exports = pool;