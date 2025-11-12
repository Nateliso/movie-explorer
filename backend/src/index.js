const app = require('./app');
const initDatabase = require('./models/init');
const fs = require("fs");
const path = require("path");
console.log("Files in certs:", 
  fs.readdirSync(path.join(__dirname, "certs")).join(", ")
);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();