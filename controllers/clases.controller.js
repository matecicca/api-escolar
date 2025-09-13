
// controllers/clases.controller.js
const mongoose = require('mongoose');
const Usuario = require('../models/usuario.model.js');
const Clase = require('../models/clase.model.js');

const crearClase = async (req, res) => {
  try {
    let docenteId = req.body.docente;

    // Si es un ObjectId válido, verificamos que exista y sea docente
    if (mongoose.Types.ObjectId.isValid(docenteId)) {
      const docente = await Usuario.findOne({ _id: docenteId, tipo: 'docente' });
      if (!docente) {
        return res.status(400).json({ mensaje: 'El docente no existe o no es válido' });
      }
    } else {
      // Si no es ObjectId, asumimos que es un email
      const docente = await Usuario.findOne({ email: docenteId, tipo: 'docente' });
      if (!docente) {
        return res.status(400).json({ mensaje: 'El docente no existe o no es válido' });
      }
      docenteId = docente._id;
    }

    const nuevaClase = new Clase({
      ...req.body,
      docente: docenteId
    });

    const claseGuardada = await nuevaClase.save();
    res.status(201).json(claseGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};



// Obtener todas las clases (con filtro opcional por docente)
const getClases = async (req, res) => {
  try {
    const { docente } = req.query; // 👈 leemos query param ?docente=<id|email>
    let clases;

    if (docente) {
      let docenteId = docente;

      // Si es un ObjectId válido, buscamos por _id
      if (mongoose.Types.ObjectId.isValid(docenteId)) {
        clases = await Clase.find({ docente: docenteId }).populate('docente', 'nombre email tipo');
      } else {
        // Si no es ObjectId, lo tomamos como email
        const docenteEncontrado = await Usuario.findOne({ email: docente, tipo: 'docente' });
        if (!docenteEncontrado) {
          return res.status(404).json({ mensaje: 'Docente no encontrado' });
        }
        clases = await Clase.find({ docente: docenteEncontrado._id }).populate('docente', 'nombre email tipo');
      }
    } else {
      // Sin filtro → trae todas
      clases = await Clase.find().populate('docente', 'nombre email tipo');
    }

    res.json(clases);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener una clase por ID con info del docente
const getClaseById = async (req, res) => {
  try {
    const clase = await Clase.findById(req.params.id).populate('docente', 'nombre email tipo');
    if (!clase) return res.status(404).json({ mensaje: 'Clase no encontrada' });
    res.json(clase);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const actualizarClase = async (req, res) => {
  try {
    let docenteId = req.body.docente;

    if (docenteId) {
      if (mongoose.Types.ObjectId.isValid(docenteId)) {
        const docente = await Usuario.findOne({ _id: docenteId, tipo: 'docente' });
        if (!docente) {
          return res.status(400).json({ mensaje: 'El docente no existe o no es válido' });
        }
      } else {
        const docente = await Usuario.findOne({ email: docenteId, tipo: 'docente' });
        if (!docente) {
          return res.status(400).json({ mensaje: 'El docente no existe o no es válido' });
        }
        docenteId = docente._id;
      }
      req.body.docente = docenteId;
    }

    const clase = await Clase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('docente', 'nombre email tipo');

    if (!clase) return res.status(404).json({ mensaje: 'Clase no encontrada' });
    res.json(clase);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};


// Eliminar clase
const eliminarClase = async (req, res) => {
  try {
    const clase = await Clase.findByIdAndDelete(req.params.id);
    if (!clase) return res.status(404).json({ mensaje: 'Clase no encontrada' });
    res.json({ mensaje: 'Clase eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = {
  getClases,
  getClaseById,
  crearClase,
  actualizarClase,
  eliminarClase
};
