const express = require('express');
const router = express.Router();

const validateAlumno = require('../middlewares/validateAlumno');
const authAlumno = require('../middlewares/authAlumno');
const authAdmin = require('../middlewares/authAdmin');

const Clase = require('../models/clase');
const Alumno = require('../models/alumno');
const alumnoController = require('../controllers/alumnoController');

// Registro y login
router.post('/', validateAlumno, alumnoController.createAlumno);
router.post('/login', alumnoController.loginAlumno);

// Vista privada del alumno
router.get('/mi-clase', authAlumno, async (req, res) => {
  try {
    const clase = await Clase.findOne({ alumnos: req.alumno.id })
      .populate('maestro', 'nombre apellido correo')
      .populate('alumnos', 'nombre correo');

    if (!clase) {
      return res.status(404).json({ message: 'No estás asignado a ninguna clase.' });
    }

    res.status(200).json(clase);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar tu clase.', error });
  }
});

// Panel del alumno
router.get('/panel', authAlumno, async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.alumno.id).populate({
      path: 'clase',
      populate: {
        path: 'maestro',
        select: 'nombre apellido'
      }
    });

    if (!alumno || !alumno.clase) {
      return res.status(404).json({ message: 'No se encontró clase asignada.' });
    }

    const clase = alumno.clase;
    const maestro = clase.maestro;
    const siguienteSesion = calcularProximaSesion(clase.dias, clase.hora);

    res.json({
      nombre: alumno.nombre,
      clase: clase.nombre,
      horario: clase.hora,
      profesor: `${maestro.nombre} ${maestro.apellido}`,
      siguienteSesion,
      mensaje: alumno.mensaje || ""
    });
  } catch (error) {
    console.error('❌ Error en /panel:', error);
    res.status(500).json({ message: 'Error al obtener panel del alumno.' });
  }
});

// Función para calcular próxima sesión según días disponibles
function calcularProximaSesion(diasClase, hora) {
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const hoy = new Date();
  const hoyIndex = hoy.getDay();

  // Encontrar el próximo día válido
  const indicesDiasClase = diasClase.map(d => diasSemana.indexOf(d)).filter(i => i >= 0).sort();
  let proximoIndex = indicesDiasClase.find(i => i >= hoyIndex);
  if (proximoIndex === undefined) proximoIndex = indicesDiasClase[0];

  const diasHastaSesion = (proximoIndex - hoyIndex + 7) % 7;
  const proximaFecha = new Date();
  proximaFecha.setDate(hoy.getDate() + diasHastaSesion);

  const opciones = { weekday: "long", day: "numeric", month: "long" };
  const fechaTexto = proximaFecha.toLocaleDateString("es-MX", opciones);
  return `${fechaTexto} a las ${hora}`;
}

// Obtener alumnos sin clase asignada (para administrador)
router.get('/disponibles', authAdmin, alumnoController.getAlumnosSinClase);

// Vista para administrador
router.get('/', authAdmin, async (req, res) => {
  try {
    const alumnos = await Alumno.find();
    res.status(200).json(alumnos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener alumnos.', error });
  }
});

router.get('/:id', authAdmin, alumnoController.getAlumnoById);
router.put('/:id', authAdmin, alumnoController.updateAlumno);
router.delete('/:id', authAdmin, alumnoController.deleteAlumno);

module.exports = router;
