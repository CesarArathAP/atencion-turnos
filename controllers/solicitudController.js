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
        res.redirect(`/?error=${encodeURIComponent(error.message)}`);
    }
};

exports.agregarSolicitud = async (req, res) => {
    try {
        const { numero, nombre, tiempo } = req.body;
        await solicitudModel.agregarSolicitud(numero, nombre, tiempo);
        res.redirect('/?success=Solicitud agregada correctamente');
    } catch (error) {
        res.redirect(`/?error=${encodeURIComponent(error.message)}`);
    }
};

exports.optimizarAtencion = async (req, res) => {
    try {
        await solicitudModel.optimizarAtencion();
        res.redirect('/?success=Órden optimizado correctamente');
    } catch (error) {
        res.redirect(`/?error=${encodeURIComponent(error.message)}`);
    }
};

exports.limpiarSolicitudes = async (req, res) => {
    try {
        await solicitudModel.limpiarSolicitudes();
        res.redirect('/?success=Solicitudes limpiadas correctamente');
    } catch (error) {
        res.redirect(`/?error=${encodeURIComponent(error.message)}`);
    }
};