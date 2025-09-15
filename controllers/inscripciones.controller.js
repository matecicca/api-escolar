// controllers/inscripciones.controller.js
const mongoose = require('mongoose');
const Usuario = require('../models/usuario.model.js');
const Clase = require('../models/clase.model.js');
const Inscripcion = require('../models/inscripcion.model.js');

const crearInscripcion = async (req, res) => {
  try {
    let alumnoId = req.body.alumno;
    let claseInput = req.body.clase;
    let claseDoc;

    // 🔹 Validar alumno (ID o email)
    if (mongoose.Types.ObjectId.isValid(alumnoId)) {
      const alumno = await Usuario.findOne({ _id: alumnoId, tipo: 'alumno' });
      if (!alumno) return res.status(400).json({ mensaje: 'El alumno no existe o no es válido' });
    } else {
      const alumno = await Usuario.findOne({ email: alumnoId, tipo: 'alumno' });
      if (!alumno) return res.status(400).json({ mensaje: 'El alumno no existe o no es válido' });
      alumnoId = alumno._id;
    }

    // 🔹 Validar clase (classCode numérico o ID)
    if (typeof claseInput === 'number' || !isNaN(claseInput)) {
      claseDoc = await Clase.findOne({ classCode: parseInt(claseInput) });
    } else if (mongoose.Types.ObjectId.isValid(claseInput)) {
      claseDoc = await Clase.findById(claseInput);
    }

    if (!claseDoc) return res.status(400).json({ mensaje: 'La clase no existe o no es válida' });

    // 🔹 Evitar inscripciones duplicadas
    const inscripcionExistente = await Inscripcion.findOne({
      alumno: alumnoId,
      clase: claseDoc._id
    });

    if (inscripcionExistente) {
      return res.status(400).json({ mensaje: 'El alumno ya está inscripto en esta clase' });
    }

    // 🔹 Crear inscripción
    const nuevaInscripcion = new Inscripcion({
      alumno: alumnoId,
      clase: claseDoc._id
    });

    const inscripcionGuardada = await nuevaInscripcion.save();

    res.status(201).json(await inscripcionGuardada.populate([
      { path: 'alumno', select: 'nombre email tipo' },
      { path: 'clase', select: 'nombre classCode fecha' }
    ]));
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};


// Obtener todas las inscripciones (filtro por alumno o clase)
const getInscripciones = async (req, res) => {
  try {
    const { alumno, clase } = req.query;
    let filtro = {};

    // 🔹 Filtrar por alumno (ID o email)
    if (alumno) {
      let alumnoId = alumno;
      if (mongoose.Types.ObjectId.isValid(alumnoId)) {
        const alumnoDoc = await Usuario.findOne({ _id: alumnoId, tipo: 'alumno' });
        if (!alumnoDoc) return res.status(404).json({ mensaje: 'Alumno no encontrado' });
        filtro.alumno = alumnoId;
      } else {
        const alumnoDoc = await Usuario.findOne({ email: alumno, tipo: 'alumno' });
        if (!alumnoDoc) return res.status(404).json({ mensaje: 'Alumno no encontrado' });
        filtro.alumno = alumnoDoc._id;
      }
    }

    // 🔹 Filtrar por clase (classCode numérico o ID)
    if (clase) {
      if (typeof clase === 'number' || !isNaN(clase)) {
        const claseDoc = await Clase.findOne({ classCode: parseInt(clase) });
        if (!claseDoc) return res.status(404).json({ mensaje: 'Clase no encontrada' });
        filtro.clase = claseDoc._id;
      } else if (mongoose.Types.ObjectId.isValid(clase)) {
        const claseDoc = await Clase.findById(clase);
        if (!claseDoc) return res.status(404).json({ mensaje: 'Clase no encontrada' });
        filtro.clase = clase;
      } else {
        return res.status(400).json({ mensaje: 'El parámetro clase debe ser un ID válido o un classCode numérico' });
      }
    }

    // Buscar inscripciones con populate
    const inscripciones = await Inscripcion.find(filtro)
      .populate('alumno', 'nombre email tipo')
      .populate('clase', 'nombre classCode fecha');

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
