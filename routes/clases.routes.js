// routes/clases.routes.js
const express = require('express');
const router = express.Router();
const controlador = require('../controllers/clases.controller.js');

router.get('/', controlador.getClases);
router.get('/:id', controlador.getClaseById);
router.post('/', controlador.crearClase);
router.put('/:id', controlador.actualizarClase);
router.delete('/:id', controlador.eliminarClase);

module.exports = router;
