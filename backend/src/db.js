const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

console.log("DB init: NODE_ENV =", process.env.NODE_ENV);

const isProduction = process.env.NODE_ENV === "production";

let sslConfig = { rejectUnauthorized: false }; // default

if (isProduction) {
  const caPath = path.join(__dirname, "certs", "ca.pem");
  
  console.log("Looking for CA at:", caPath);
  
  try {
    if (fs.existsSync(caPath)) {
      const caCert = fs.readFileSync(caPath, "utf8");
      console.log("CA cert loaded, length:", caCert.length);
      sslConfig = {
        rejectUnauthorized: true,
        ca: caCert,
      };
    } else {
      console.error("CA file NOT found at:", caPath);
    }
  } catch (err) {
    console.error("Failed to read CA cert:", err.message);
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});

// LOG EVERYTHING
pool.on("connect", () => console.log("Connected to Aiven PostgreSQL"));
pool.on("error", (err) => console.error("Pool error:", err));
pool.on("acquire", () => console.log("Client acquired"));
pool.on("remove", () => console.log("Client removed"));

module.exports = pool;