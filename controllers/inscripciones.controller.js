// controllers/inscripciones.controller.js
const mongoose = require('mongoose');
const Usuario = require('../models/usuario.model.js');
const Clase = require('../models/clase.model.js');
const Inscripcion = require('../models/inscripcion.model.js');

// Crear inscripción (validar que alumno exista y sea de tipo alumno)
const crearInscripcion = async (req, res) => {
  try {
    const { alumno, clase } = req.body;

    // Validar alumno
    let alumnoId = alumno;
    if (!mongoose.Types.ObjectId.isValid(alumnoId)) {
      const alumnoDoc = await Usuario.findOne({ email: alumno, tipo: 'alumno' });
      if (!alumnoDoc) return res.status(400).json({ mensaje: 'El alumno no existe o no es válido' });
      alumnoId = alumnoDoc._id;
    } else {
      const alumnoDoc = await Usuario.findOne({ _id: alumnoId, tipo: 'alumno' });
      if (!alumnoDoc) return res.status(400).json({ mensaje: 'El alumno no existe o no es válido' });
    }

    // Validar clase
    if (!mongoose.Types.ObjectId.isValid(clase)) {
      return res.status(400).json({ mensaje: 'El ID de clase no es válido' });
    }
    const claseDoc = await Clase.findById(clase);
    if (!claseDoc) return res.status(400).json({ mensaje: 'La clase no existe' });

    // Crear inscripción
    const nuevaInscripcion = new Inscripcion({ alumno: alumnoId, clase });
    const inscripcionGuardada = await nuevaInscripcion.save();

    res.status(201).json(inscripcionGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Obtener todas las inscripciones (opcionalmente filtrar por alumno o clase)
const getInscripciones = async (req, res) => {
  try {
    const { alumno, clase } = req.query;
    let filtro = {};

    if (alumno) {
      let alumnoId = alumno;
      if (!mongoose.Types.ObjectId.isValid(alumnoId)) {
        const alumnoDoc = await Usuario.findOne({ email: alumno, tipo: 'alumno' });
        if (!alumnoDoc) return res.status(404).json({ mensaje: 'Alumno no encontrado' });
        alumnoId = alumnoDoc._id;
      }
      filtro.alumno = alumnoId;
    }

    if (clase) {
      filtro.clase = clase;
    }

    const inscripciones = await Inscripcion.find(filtro)
      .populate('alumno', 'nombre email tipo')
      .populate('clase', 'nombre descripcion fecha');

    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar inscripción
const eliminarInscripcion = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByIdAndDelete(req.params.id);
    if (!inscripcion) return res.status(404).json({ mensaje: 'Inscripción no encontrada' });
    res.json({ mensaje: 'Inscripción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = {
  crearInscripcion,
  getInscripciones,
  eliminarInscripcion
};
