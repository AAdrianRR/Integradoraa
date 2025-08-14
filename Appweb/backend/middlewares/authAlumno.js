const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config'); 

const authAlumno = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado.' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.rol !== 'alumno') {
      return res.status(403).json({ message: 'Acceso restringido a alumnos.' });
    }

    req.alumno = decoded;
    next();
  } catch (error) {
    console.error('Error en authAlumno:', error);
    res.status(400).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authAlumno;
