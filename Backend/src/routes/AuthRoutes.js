const { Router } = require('express');
const { body } = require('express-validator');
const validar = require('../middlewares/validate');
const autenticar = require('../middlewares/auth');
const { registro, login, logout } = require('../controllers/AuthController');

const router = Router();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registro de usuarios
 *     tags: [Auth]
 */
router.post('/register',
  [body('nombre').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  validar, registro);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Inicio de sesión
 *     tags: [Auth]
 */
router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validar, login);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Cierre de sesión
 *     tags: [Auth]
 */
router.post('/logout', autenticar, logout);

module.exports = router;