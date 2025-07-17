const db = require('../db/conexion');

class Solicitud {
  static crear(nombre, tiempo, callback) {
    const query = 'INSERT INTO solicitudes (nombre, tiempo) VALUES (?, ?)';
    db.run(query, [nombre, tiempo], function (err) {
      callback(err, this?.lastID);
    });
  }

  static obtenerTodas(callback) {
    db.all('SELECT * FROM solicitudes ORDER BY tiempo ASC', [], callback);
  }
}

module.exports = Solicitud;