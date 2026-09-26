const { Router } = require('express');
const { body } = require('express-validator');
const validar = require('../middlewares/validate');
const { enviarContacto } = require('../controllers/ContactoController');

const router = Router();

/**
 * @swagger
 * /api/contacto:
 *   post:
 *     summary: Envía un mensaje de contacto por correo
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, mensaje]
 *             properties:
 *               email: { type: string }
 *               mensaje: { type: string }
 *     responses:
 *       200: { description: Correo enviado }
 *       400: { description: Faltan campos }
 *       500: { description: Error al enviar }
 */
router.post(
  '/',
  [body('email').isEmail(), body('mensaje').isLength({ min: 10 })],
  validar,
  enviarContacto
);

module.exports = router;
