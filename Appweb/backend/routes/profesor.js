const express = require('express');
const router = express.Router();
const {
  registrarProfesor,
  loginProfesor,
  listarProfesores,
  eliminarProfesor,
  actualizarProfesor
} = require('../controllers/profesorController');

const authProfesor = require('../middlewares/authProfesor');
const authAdmin = require('../middlewares/authAdmin');
const Clase = require('../models/clase');

// 🔐 Registro y login
router.post('/registrar', authAdmin, registrarProfesor);  // solo admin
router.post('/login', loginProfesor);

// 📘 Clases del profesor actual
router.get('/mis-clases', authProfesor, async (req, res) => {
  try {
    const clases = await Clase.find({ maestro: req.profesor.id })
      .populate('alumnos', 'nombre correo')
      .populate('maestro', 'nombre apellido correo');
    res.status(200).json(clases);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las clases del profesor.', error });
  }
});

// 🔧 CRUD del módulo profesores (solo admin)
router.get('/', authAdmin, listarProfesores);        // listar todos
router.put('/:id', authAdmin, actualizarProfesor);   // actualizar por ID
router.delete('/:id', authAdmin, eliminarProfesor);  // eliminar por ID

module.exports = router;
