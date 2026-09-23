const { Router } = require('express');
const { body } = require('express-validator');
const autenticar = require('../middlewares/auth');
const validar = require('../middlewares/validate');
const controlador = require('../controllers/CitasController');

const router = Router();
router.use(autenticar);

const reglas = [
  body('paciente_id').notEmpty().isMongoId(),
  body('doctor_id').notEmpty().isMongoId(),
  body('fecha_cita').isISO8601().toDate(),
];

/**
 * @swagger
 * tags:
 *   name: Citas
 * /api/citas:
 *   get:
 *     summary: Listar citas
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de citas }
 *   post:
 *     summary: Crear cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paciente_id, doctor_id, fecha_cita]
 *             properties:
 *               paciente_id: { type: string }
 *               doctor_id: { type: string }
 *               fecha_cita: { type: string, format: date-time }
 *               notas: { type: string }
 *     responses:
 *       201: { description: Cita creada }
 *       422: { description: Fecha inválida }
 *       409: { description: Choque de horario con el doctor }
 * /api/citas/{id}:
 *   get:
 *     summary: Obtener una cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Cita encontrada }
 *   put:
 *     summary: Actualizar cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_cita: { type: string, format: date-time }
 *               estado: { type: string, enum: [pendiente, confirmada, cancelada, completada] }
 *               notas: { type: string }
 *     responses:
 *       200: { description: Cita actualizada }
 *   delete:
 *     summary: Eliminar cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Cita eliminada }
 */
router.get('/', controlador.listar);
router.get('/:id', controlador.obtener);
router.post('/', reglas, validar, controlador.crear);
router.put('/:id', controlador.actualizar);
router.delete('/:id', controlador.eliminar);

module.exports = router;