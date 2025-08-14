function validateAlumno(req, res, next) {
  const { esMenorEdad, padre } = req.body;

  if (typeof esMenorEdad !== 'boolean') {
    return res.status(400).json({ message: "El campo 'esMenorEdad' debe ser booleano." });
  }

  if (esMenorEdad) {
    if (
      !padre ||
      typeof padre !== 'object' ||
      typeof padre.nombre !== 'string' ||
      typeof padre.telefono !== 'string' ||
      !padre.nombre.trim() ||
      !padre.telefono.trim()
    ) {
      return res.status(400).json({ message: "Faltan nombre y teléfono del tutor." });
    }
  }

  if (!esMenorEdad && padre) {
    return res.status(400).json({ message: "No debes enviar datos del tutor si el alumno es mayor de edad." });
  }

  next();
}

module.exports = validateAlumno;
