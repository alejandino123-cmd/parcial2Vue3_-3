require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => console.log('Servidor arriba'));
});