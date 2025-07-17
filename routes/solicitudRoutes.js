const express = require('express');
const router = express.Router();
const controlador = require('../controllers/solicitudController');

router.get('/turnos', controlador.obtenerTurnos);

module.exports = router;