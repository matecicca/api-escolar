
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  tipo: {
    type: String,
    enum: ['alumno', 'docente'],
    required: [true, 'El tipo es obligatorio']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    match: [/.+@.+\..+/, 'Formato de email inválido']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);
