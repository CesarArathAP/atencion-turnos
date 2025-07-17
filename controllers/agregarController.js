const Solicitud = require('../models/Solicitud');

exports.agregarSolicitud = (req, res) => {
  const { nombre, tiempo } = req.body;
  if (!nombre || !tiempo || tiempo < 1 || tiempo > 120) {
    return res.status(400).send("Datos inválidos. Tiempo debe ser entre 1 y 120.");
  }

  Solicitud.crear(nombre, parseInt(tiempo), (err) => {
    if (err) return res.status(500).send("Error al registrar solicitud");
    res.redirect('/');
  });
};