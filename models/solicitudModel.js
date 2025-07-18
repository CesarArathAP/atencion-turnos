const db = require('../db/conexion');

class SolicitudModel {
    async agregarSolicitud(numero, nombre, tiempo) {
        if (tiempo > 120) {
            throw new Error('El tiempo máximo por solicitud es de 120 minutos');
        }

        // Obtener fecha y hora actual en formato local de México
        const ahora = new Date();
        const opciones = {
            timeZone: 'America/Mexico_City',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const fechaLocal = ahora.toLocaleString('es-MX', opciones);

        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO solicitudes (numero, nombre, tiempo, fecha_creacion) VALUES (?, ?, ?, ?)',
                [numero, nombre, tiempo, fechaLocal],
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
                if (err) {
                    console.error('Error al limpiar solicitudes:', err);
                    reject(err);
                } else {
                    console.log(`Solicitudes eliminadas: ${this.changes}`);
                    resolve(this.changes);
                }
            });
        });
    }
}

module.exports = new SolicitudModel();