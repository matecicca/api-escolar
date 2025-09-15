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

    // 🔹 Validar alumno (ID, email o nombre)
    if (mongoose.Types.ObjectId.isValid(alumnoId)) {
      const alumno = await Usuario.findOne({ _id: alumnoId, tipo: 'alumno' });
      if (!alumno) return res.status(400).json({ mensaje: 'El alumno no existe o no es válido' });
    } else if (typeof alumnoId === 'string' && alumnoId.includes('@')) {
      const alumno = await Usuario.findOne({ email: alumnoId, tipo: 'alumno' });
      if (!alumno) return res.status(400).json({ mensaje: 'El alumno no existe o no es válido' });
      alumnoId = alumno._id;
    } else {
      const alumno = await Usuario.findOne({ nombre: new RegExp(alumnoId.trim(), 'i'), tipo: 'alumno' });
      if (!alumno) return res.status(400).json({ mensaje: 'El alumno no existe o no es válido' });
      alumnoId = alumno._id;
    }

    // 🔹 Validar clase (classCode numérico, ID o nombre)
    if (typeof claseInput === 'number' || !isNaN(claseInput)) {
      claseDoc = await Clase.findOne({ classCode: parseInt(claseInput) });
    } else if (mongoose.Types.ObjectId.isValid(claseInput)) {
      claseDoc = await Clase.findById(claseInput);
    } else {
      claseDoc = await Clase.findOne({ nombre: new RegExp(claseInput.trim(), 'i') });
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
      { path: 'clase', select: 'nombre classCode fecha docente', populate: { path: 'docente', select: 'nombre email' } }
    ]));
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Obtener todas las inscripciones (filtro por alumno, clase o docente)
const getInscripciones = async (req, res) => {
  try {
    const { alumno, clase, docente } = req.query;
    let filtro = {};

    // 🔹 Filtrar por alumno (ID, email o nombre)
    if (alumno) {
      if (mongoose.Types.ObjectId.isValid(alumno)) {
        const alumnoDoc = await Usuario.findOne({ _id: alumno, tipo: 'alumno' });
        if (!alumnoDoc) return res.status(404).json({ mensaje: 'Alumno no encontrado' });
        filtro.alumno = alumno;
      } else if (alumno.includes('@')) {
        const alumnoDoc = await Usuario.findOne({ email: alumno, tipo: 'alumno' });
        if (!alumnoDoc) return res.status(404).json({ mensaje: 'Alumno no encontrado' });
        filtro.alumno = alumnoDoc._id;
      } else {
        const alumnoDoc = await Usuario.findOne({ nombre: new RegExp(alumno.trim(), 'i'), tipo: 'alumno' });
        if (!alumnoDoc) return res.status(404).json({ mensaje: 'Alumno no encontrado' });
        filtro.alumno = alumnoDoc._id;
      }
    }

    // 🔹 Filtrar por clase (ID, classCode o nombre)
    if (clase) {
      let claseDoc;
      if (mongoose.Types.ObjectId.isValid(clase)) {
        claseDoc = await Clase.findById(clase);
      } else if (!isNaN(clase)) {
        claseDoc = await Clase.findOne({ classCode: parseInt(clase) });
      } else {
        claseDoc = await Clase.findOne({ nombre: new RegExp(clase.trim(), 'i') });
      }
      if (!claseDoc) return res.status(404).json({ mensaje: 'Clase no encontrada' });
      filtro.clase = claseDoc._id;
    }

    // 🔹 Filtrar por docente (nombre)
    if (docente) {
      const docentes = await Usuario.find({ nombre: new RegExp(docente.trim(), 'i'), tipo: 'docente' });
      if (!docentes.length) return res.status(404).json({ mensaje: 'Docente no encontrado' });

      const clasesDocente = await Clase.find({ docente: { $in: docentes.map(d => d._id) } });
      if (!clasesDocente.length) return res.status(404).json({ mensaje: 'No se encontraron clases para este docente' });

      filtro.clase = { $in: clasesDocente.map(c => c._id) };
    }

    // Buscar inscripciones con populate
    const inscripciones = await Inscripcion.find(filtro)
      .populate('alumno', 'nombre email tipo')
      .populate({
        path: 'clase',
        select: 'nombre classCode fecha docente',
        populate: { path: 'docente', select: 'nombre email' }
      });

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
