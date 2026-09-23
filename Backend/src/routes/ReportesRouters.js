const { Router } = require('express');
const autenticar = require('../middlewares/auth');
const controlador = require('../controllers/ReportesController');

const router = Router();
router.use(autenticar);

router.get('/citas-por-estado', controlador.citasPorEstado);
router.get('/citas-por-doctor', controlador.citasPorDoctor);

module.exports = router;