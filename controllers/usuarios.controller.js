// controllers/usuarios.controller.js
const Usuario = require('../models/usuario.model.js');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios (con filtros por tipo y nombre)
const getUsuarios = async (req, res) => {
  try {
    const { tipo, nombre } = req.query;
    let filtro = {};

    // Filtro por tipo
    if (tipo) {
      filtro.tipo = tipo;
    }

    // Filtro por nombre
    if (nombre) {
      filtro.nombre = new RegExp(nombre.trim(), 'i');
    }

    const usuarios = await Usuario.find(filtro);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const passHash = bcrypt.hash(password, 5);
    const nuevoUsuario = new Usuario(nombre, tipo, email, passHash);
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};
