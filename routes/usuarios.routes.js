// routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const controlador = require('../controllers/usuarios.controller.js');

// Definición de rutas
router.get('/', controlador.getUsuarios);
router.get('/:id', controlador.getUsuarioById);
router.post('/', controlador.crearUsuario);
router.put('/:id', controlador.actualizarUsuario);
router.delete('/:id', controlador.eliminarUsuario);

module.exports = router;
