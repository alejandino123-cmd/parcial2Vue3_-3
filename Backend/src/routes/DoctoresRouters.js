const { Router } = require('express');
const { body } = require('express-validator');
const autenticar = require('../middlewares/auth');
const validar = require('../middlewares/validate');
const controlador = require('../controllers/DoctoresController');

const router = Router();
router.use(autenticar);

const reglas = [
  body('nombre').notEmpty(),
  body('email').isEmail(),
  body('especialidad').notEmpty(),
  body('telefono').notEmpty(),
];

/**
 * @swagger
 * tags:
 *   name: Doctores
 * /api/doctores:
 *   get:
 *     summary: Listar doctores
 *     tags: [Doctores]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de doctores }
 *   post:
 *     summary: Crear doctor
 *     tags: [Doctores]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, especialidad, telefono]
 *             properties:
 *               nombre: { type: string }
 *               email: { type: string }
 *               especialidad: { type: string }
 *               telefono: { type: string }
 *               cualificaciones: { type: string }
 *     responses:
 *       201: { description: Doctor creado }
 * /api/doctores/{id}:
 *   get:
 *     summary: Obtener un doctor
 *     tags: [Doctores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Doctor encontrado }
 *   put:
 *     summary: Actualizar doctor
 *     tags: [Doctores]
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
 *               nombre: { type: string }
 *               email: { type: string }
 *               especialidad: { type: string }
 *               telefono: { type: string }
 *               cualificaciones: { type: string }
 *     responses:
 *       200: { description: Doctor actualizado }
 *   delete:
 *     summary: Eliminar doctor
 *     tags: [Doctores]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Doctor eliminado }
 */
router.get('/', controlador.listar);
router.get('/:id', controlador.obtener);
router.post('/', reglas, validar, controlador.crear);
router.put('/:id', reglas, validar, controlador.actualizar);
router.delete('/:id', controlador.eliminar);

module.exports = router;