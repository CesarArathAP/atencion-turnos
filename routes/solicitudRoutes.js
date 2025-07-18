const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');

router.get('/', solicitudController.mostrarIndex);
router.post('/solicitudes', solicitudController.agregarSolicitud);
router.get('/solicitudes/optimizar', solicitudController.optimizarAtencion);
router.delete('/solicitudes', solicitudController.limpiarSolicitudes);

module.exports = router;