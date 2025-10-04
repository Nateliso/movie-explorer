require('dotenv').config();
const initDatabase = require('./models/init');
initDatabase().then(() => process.exit());