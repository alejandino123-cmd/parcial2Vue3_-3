const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const rutas = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', rutas);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Sistema de Gestión Médica activa', docs: '/api-docs' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ mensaje: err.message || 'Error interno del servidor' });
});

module.exports = app;