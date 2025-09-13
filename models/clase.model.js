// models/clase.model.js
const mongoose = require('mongoose');

const claseSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la clase es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  docente: {
    type: mongoose.Schema.Types.ObjectId,   // 👈 Guardamos un ObjectId
    ref: 'Usuario',                         // 👈 Referencia al modelo Usuario
    required: [true, 'El docente es obligatorio']
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha de la clase es obligatoria']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Clase', claseSchema);
