const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const ssl = isProduction
  ? {
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.join(__dirname, "certs", "ca.pem"), "utf8"),
    }
  : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
});

pool.on("connect", () => console.log("Connected to Aiven PostgreSQL"));
pool.on("error", (err) => {
  console.error("Database pool error:", err.message);
});

module.exports = pool;