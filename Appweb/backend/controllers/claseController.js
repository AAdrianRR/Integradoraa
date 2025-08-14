
const Clase = require("../models/clase");
const Alumno = require("../models/alumno");


const createClase = async (req, res) => {
  try {
    const nuevaClase = new Clase(req.body);
    await nuevaClase.save();
    res.status(201).json({ message: "Clase creada con éxito", clase: nuevaClase });
  } catch (error) {
    console.error("Error al crear clase:", error);
    res.status(500).json({ message: "Error al crear clase", error });
  }
};


const obtenerClases = async (req, res) => {
  try {
    const clases = await Clase.find()
      .populate("maestro", "nombre apellido")
      .populate("alumnos", "nombre apellido");
    res.status(200).json(clases);
  } catch (error) {
    console.error(" Error al obtener clases:", error);
    res.status(500).json({ message: "Error al obtener clases", error });
  }
};

// 🔍 Obtener clase por ID
const obtenerClasePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const clase = await Clase.findById(id)
      .populate("maestro", "nombre apellido")
      .populate("alumnos", "nombre apellido");

    if (!clase) {
      return res.status(404).json({ message: "Clase no encontrada." });
    }

    res.status(200).json(clase);
  } catch (error) {
    console.error("❌ Error al obtener clase por ID:", error);
    res.status(500).json({ message: "Error al obtener clase por ID", error });
  }
};


const actualizarClase = async (req, res) => {
  try {
    const { id } = req.params;

    const claseActualizada = await Clase.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })
      .populate("maestro", "nombre apellido")
      .populate("alumnos", "nombre apellido");

    if (!claseActualizada) {
      return res.status(404).json({ message: "Clase no encontrada." });
    }

    res.status(200).json({ message: "Clase actualizada con éxito", clase: claseActualizada });
  } catch (error) {
    console.error("❌ Error al actualizar clase:", error);
    res.status(500).json({ message: "Error al actualizar clase", error });
  }
};

// Eliminar clase por ID
const eliminarClase = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Clase.findByIdAndDelete(id);

    if (!resultado) {
      return res.status(404).json({ message: "Clase no encontrada para eliminar." });
    }

    res.status(200).json({ message: "Clase eliminada con éxito." });
  } catch (error) {
    console.error(" Error al eliminar clase:", error);
    res.status(500).json({ message: "Error al eliminar clase", error });
  }
};


const asignarAlumnos = async (req, res) => {
  try {
    const claseId = req.params.id;
    const { alumnos } = req.body;

    if (!Array.isArray(alumnos) || alumnos.length === 0) {
      return res.status(400).json({ message: "Lista de alumnos inválida." });
    }

    const clase = await Clase.findById(claseId);
    if (!clase) {
      return res.status(404).json({ message: "Clase no encontrada." });
    }

    const nuevosAlumnos = alumnos.filter(id => !clase.alumnos.includes(id));
    clase.alumnos.push(...nuevosAlumnos);
    await clase.save();

    await Alumno.updateMany(
      { _id: { $in: nuevosAlumnos } },
      { clase: claseId }
    );

    res.status(200).json({ message: "Alumnos asignados correctamente." });
  } catch (error) {
    console.error("❌ Error al asignar alumnos:", error);
    res.status(500).json({ message: "Error al asignar alumnos.", error });
  }
};

// 
const obtenerClasesPorProfesor = async (req, res) => {
  try {
    const profesorId = req.profesor.id;
    const clases = await Clase.find({ maestro: profesorId })
      .populate("alumnos", "nombre apellido")
      .populate("maestro", "nombre apellido");
    res.status(200).json(clases);
  } catch (error) {
    console.error("❌ Error al obtener clases del profesor:", error);
    res.status(500).json({ message: "Error al obtener clases del profesor", error });
  }
};

module.exports = {
  createClase,
  obtenerClases,
  obtenerClasePorId,
  actualizarClase,
  eliminarClase,
  asignarAlumnos,
  obtenerClasesPorProfesor 
};
