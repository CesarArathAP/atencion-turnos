const db = require('./conexion');

// Crear tablas si no existen
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS solicitudes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero INTEGER NOT NULL UNIQUE,
            nombre TEXT NOT NULL,
            tiempo INTEGER NOT NULL CHECK(tiempo <= 120),
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error al crear tabla solicitudes:', err);
        } else {
            console.log('Tabla solicitudes creada/verificada');
        }
    });
});

module.exports = db;