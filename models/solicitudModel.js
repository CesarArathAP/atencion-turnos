const db = require('../db/conexion');

class SolicitudModel {
    async agregarSolicitud(numero, nombre, tiempo) {
        if (tiempo > 120) {
            throw new Error('El tiempo máximo por solicitud es de 120 minutos');
        }

        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO solicitudes (numero, nombre, tiempo) VALUES (?, ?, ?)',
                [numero, nombre, tiempo],
                function(err) {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            reject(new Error('El número de solicitud ya existe'));
                        } else {
                            reject(err);
                        }
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    }

    async obtenerSolicitudes() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM solicitudes ORDER BY id', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    async optimizarAtencion() {
        const solicitudes = await this.obtenerSolicitudes();
        
        // Ordenar por tiempo ascendente (SJF)
        const ordenOptimo = [...solicitudes].sort((a, b) => a.tiempo - b.tiempo);
        
        // Calcular inconformidad
        let tiempoEspera = 0;
        let inconformidad = 0;
        for (const solicitud of ordenOptimo) {
            inconformidad += tiempoEspera;
            tiempoEspera += solicitud.tiempo;
        }
        
        return {
            ordenOptimo,
            inconformidad,
            tiempoTotal: ordenOptimo.reduce((sum, sol) => sum + sol.tiempo, 0)
        };
    }

    async limpiarSolicitudes() {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM solicitudes', [], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }
}

module.exports = new SolicitudModel();