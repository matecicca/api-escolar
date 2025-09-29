// routes/inscripciones.routes.js
const express = require('express');
const router = express.Router();
const { crearInscripcion, getInscripciones, eliminarInscripcion } = require('../controllers/inscripciones.controller.js');

router.get('/', getInscripciones);
router.post('/', crearInscripcion);
router.delete('/:id', eliminarInscripcion);

module.exports = router;
