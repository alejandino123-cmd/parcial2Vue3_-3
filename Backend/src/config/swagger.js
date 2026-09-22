const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'API - Sistema de Gestión Médica', version: '1.0.0' },
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer' } } },
  },
  apis: ['./src/routes/*.js'], // lee los comentarios @swagger de las rutas
});