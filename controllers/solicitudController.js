const solicitudModel = require('../models/solicitudModel');

exports.mostrarIndex = async (req, res) => {
    try {
        const solicitudes = await solicitudModel.obtenerSolicitudes();
        const optimizacion = await solicitudModel.optimizarAtencion();
        
        res.render('index', {
            messages: {
                success: req.query.success,
                error: req.query.error
            },
            solicitudes,
            ...optimizacion
        });
    } catch (error) {
        console.error('Error en mostrarIndex:', error);
        res.redirect(`/?error=${encodeURIComponent(error.message)}`);
    }
};

exports.agregarSolicitud = async (req, res) => {
    try {
        const { numero, nombre, tiempo } = req.body;
        
        if (!numero || !nombre || !tiempo) {
            throw new Error('Todos los campos son requeridos');
        }
        
        await solicitudModel.agregarSolicitud(numero, nombre, tiempo);
        res.redirect('/?success=Solicitud agregada correctamente');
    } catch (error) {
        console.error('Error en agregarSolicitud:', error);
        res.redirect(`/?error=${encodeURIComponent(error.message)}`);
    }
};

exports.optimizarAtencion = async (req, res) => {
    try {
        await solicitudModel.optimizarAtencion();
        res.redirect('/?success=Órden optimizado correctamente');
    } catch (error) {
        console.error('Error en optimizarAtencion:', error);
        res.redirect(`/?error=${encodeURIComponent(error.message)}`);
    }
};

exports.limpiarSolicitudes = async (req, res) => {
    try {
        const result = await solicitudModel.limpiarSolicitudes();
        if (result >= 0) {
            res.redirect('/?success=Solicitudes limpiadas correctamente');
        } else {
            throw new Error('No se pudo limpiar las solicitudes');
        }
    } catch (error) {
        console.error('Error en limpiarSolicitudes:', error);
        res.redirect(`/?error=${encodeURIComponent(error.message)}`);
    }
};