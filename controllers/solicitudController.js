const Solicitud = require('../models/Solicitud');

exports.obtenerTurnos = (req, res) => {
  Solicitud.obtenerTodas((err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener solicitudes' });

    let espera = 0;
    let inconformidad = 0;
    const resultado = rows.map(s => {
      const datos = { nombre: s.nombre, tiempo: s.tiempo, espera };
      inconformidad += espera;
      espera += s.tiempo;
      return datos;
    });

    res.json({ orden: resultado, inconformidad_total: inconformidad });
  });
};