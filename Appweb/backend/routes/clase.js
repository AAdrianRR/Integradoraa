const express = require("express");
const router = express.Router();

const {
  createClase,
  obtenerClases,
  actualizarClase,
  eliminarClase,
  obtenerClasePorId,
  asignarAlumnos,
  obtenerClasesPorProfesor
} = require("../controllers/claseController");

const authAdmin = require("../middlewares/authAdmin");
const authProfesor = require("../middlewares/authProfesor");

// Crear clase
router.post("/", authAdmin, createClase);

// Listar todas las clases
router.get("/", authAdmin, obtenerClases);

//  Obtener una clase específica por ID
router.get("/:id", authAdmin, obtenerClasePorId);

//  Actualizar clase por ID
router.put("/:id", authAdmin, actualizarClase);

//  Eliminar clase por ID
router.delete("/:id", authAdmin, eliminarClase);

//  Asignar alumnos a clase
router.patch("/:id/asignar-alumnos", authAdmin, asignarAlumnos);

// Consultar clases asignadas al profesor
router.get("/mis-clases", authProfesor, obtenerClasesPorProfesor);

module.exports = router;
