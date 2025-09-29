// models/inscripcion.model.js
const mongoose = require('mongoose');

const inscripcionSchema = new mongoose.Schema({
  alumno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  clase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clase',
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inscripcion', inscripcionSchema);
