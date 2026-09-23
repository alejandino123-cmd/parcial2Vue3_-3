require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación Swagger en http://localhost:${PORT}/api-docs`);
  });
}

iniciar().catch((error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});