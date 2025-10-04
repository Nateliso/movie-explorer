const app = require('./app');
const initDatabase = require('./models/init');
const { PORT } = process.env;

const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();