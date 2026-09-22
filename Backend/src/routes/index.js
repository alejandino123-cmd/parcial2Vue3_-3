const { Router } = require('express');
const router = Router();

router.use('/', require('./AuthRoutes'));
router.use('/pacientes', require('./pacienteRoutes'));
router.use('/doctores', require('./doctorRoutes'));
router.use('/citas', require('./citaRoutes'));
router.use('/reportes', require('./reporteRoutes'));

module.exports = router;