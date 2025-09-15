// index.js

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado correctamente a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Servir HTML
app.use(express.static(path.join(__dirname, 'public')));

const usuariosRoutes = require('./routes/usuarios.routes.js');
app.use('/usuarios', usuariosRoutes);

const clasesRoutes = require('./routes/clases.routes.js');
app.use('/clases', clasesRoutes);

const inscripcionesRoutes = require('./routes/inscripciones.routes.js');
app.use('/inscripciones', inscripcionesRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
