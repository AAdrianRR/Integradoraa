const Alumno = require('../models/alumno');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config'); 


const getAlumnosSinClase = async (req, res) => {
  try {
    const alumnos = await Alumno.find({ clase: { $exists: false } });
    res.status(200).json(alumnos);
  } catch (error) {
    console.error(" Error al obtener alumnos sin clase:", error);
    res.status(500).json({ message: "Error al obtener alumnos disponibles", error });
  }
};

// Crear alumno
const createAlumno = async (req, res) => {
  try {
    const {
      nombre, apellido, edad, correo, direccion,
      telefono, esMenorEdad, padre, contraseña, clase
    } = req.body;

    const alumnoExistente = await Alumno.findOne({ correo });
    if (alumnoExistente) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);
    const claseValida = clase?.trim() ? clase : undefined;

    const nuevoAlumno = new Alumno({
      nombre,
      apellido,
      edad,
      correo,
      direccion,
      telefono,
      esMenorEdad,
      padre: esMenorEdad ? padre : undefined,
      contraseña: contraseñaEncriptada,
      clase: claseValida
    });

    await nuevoAlumno.save();
    res.status(201).json({ message: 'Alumno registrado con éxito.', id: nuevoAlumno._id });

  } catch (error) {
    console.error('Error en createAlumno:', error);
    if (error.name === 'ValidationError') {
      const errores = Object.keys(error.errors).map(campo => ({
        campo,
        mensaje: error.errors[campo].message
      }));
      return res.status(400).json({ message: 'Error de validación.', errores });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Valor inválido en el campo "${error.path}".`, detalle: error.message });
    }
    res.status(500).json({ message: 'Error inesperado al registrar el alumno.', error });
  }
};

// Login del alumno
const loginAlumno = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const alumno = await Alumno.findOne({ correo });
    if (!alumno) {
      return res.status(404).json({ message: 'Correo no registrado.' });
    }

    const coincide = await bcrypt.compare(contraseña, alumno.contraseña);
    if (!coincide) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign({ id: alumno._id, rol: 'alumno' }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      alumno: {
        id: alumno._id,
        nombre: alumno.nombre,
        correo: alumno.correo,
        rol: 'alumno' 
      }
    });

  } catch (error) {
    console.error('Error en loginAlumno:', error);
    res.status(500).json({ message: 'Error al iniciar sesión.', error });
  }
};

const getAlumnoById = async (req, res) => {
  try {
    const alumno = await Alumno.findById(req.params.id);
    if (!alumno) return res.status(404).json({ message: 'Alumno no encontrado.' });
    res.status(200).json(alumno);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el alumno.', error });
  }
};

const updateAlumno = async (req, res) => {
  try {
    const actualizaciones = req.body;
    const alumno = await Alumno.findByIdAndUpdate(req.params.id, actualizaciones, { new: true });
    if (!alumno) return res.status(404).json({ message: 'Alumno no encontrado.' });
    res.status(200).json({ message: 'Alumno actualizado.', alumno });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el alumno.', error });
  }
};

const deleteAlumno = async (req, res) => {
  try {
    const alumno = await Alumno.findByIdAndDelete(req.params.id);
    if (!alumno) return res.status(404).json({ message: 'Alumno no encontrado.' });
    res.status(200).json({ message: 'Alumno eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el alumno.', error });
  }
};

module.exports = {
  createAlumno,
  loginAlumno,
  getAlumnoById,
  updateAlumno,
  deleteAlumno,
  getAlumnosSinClase
};
