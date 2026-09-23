const { Router } = require('express');
const router = Router();

router.use('/', require('./AuthRoutes'));
router.use('/pacientes', require('./PacientesRouters'));
router.use('/doctores', require('./DoctoresRouters'));
router.use('/citas', require('./CitasRouters'));
router.use('/reportes', require('./ReportesRouters'));

module.exports = router;