// controllers/usuarios.controller.js
const { request, response, json } = require('express');
const Usuario = require('../models/usuario.model.js');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY

// Obtener todos los usuarios (con filtros por tipo y nombre)
const getUsuarios = async (req, res) => {
  try {
    const { tipo, nombre } = req.query;
    let filtro = {};

    if (tipo) {
      filtro.tipo = tipo;
    }

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

// Crear usuario con contraseña encriptada
const crearUsuario = async (req, res) => {
  try {
    const { nombre, tipo, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      tipo,
      email,
      password: passHash
    });

    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Actualizar usuario (con hash si envían nueva contraseña)
const actualizarUsuario = async (req, res) => {
  try {
    const { password, ...resto } = req.body;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      resto.password = await bcrypt.hash(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      resto,
      { new: true, runValidators: true }
    );

    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Autenticación de usuario
const auth = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email: email });

    if (!usuario) {
      return res.status(404).json({ msg: "Email inválido" });
    }

    const isValid = await bcrypt.compare(password, usuario.password);
    if (!isValid) {
      return res.status(404).json({ msg: "Contraseña incorrecta" });
    }

    const data = {
      id: usuario._id,
      email: usuario.email
    };

    const jwt = jsonwebtoken.sign( data, SECRET_KEY, {expiresIn: '1h'})

    res.status(200).json({ msg: "Autenticación exitosa", usuarioId: usuario._id, jwt: jwt });
  } catch (error) {
    res.status(500).json({ msg: error.message, jwt: jwt });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  auth
};
