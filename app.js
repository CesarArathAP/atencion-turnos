const express = require('express');
const app = express();
const agregarRoute = require('./routes/agregar');
const solicitudRoutes = require('./routes/solicitudRoutes');
const Solicitud = require('./models/Solicitud');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Vista principal con turnos e inconformidad
app.get('/', (req, res) => {
  Solicitud.obtenerTodas((err, rows) => {
    if (err) return res.status(500).send('Error al cargar turnos');

    let espera = 0;
    let inconformidad = 0;
    const ordenados = rows.map(s => {
      const data = { nombre: s.nombre, tiempo: s.tiempo, espera };
      inconformidad += espera;
      espera += s.tiempo;
      return data;
    });

    res.render('index', {
      turnos: ordenados,
      inconformidad_total: inconformidad
    });
  });
});

app.use('/api', solicitudRoutes);
app.use('/agregar', agregarRoute); // Formulario

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});