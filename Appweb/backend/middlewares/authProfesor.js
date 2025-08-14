const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

const authProfesor = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado.' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.rol !== 'profesor') {
      return res.status(403).json({ message: 'Acceso restringido a profesores.' });
    }

    req.profesor = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authProfesor;
