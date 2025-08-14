const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config'); 

const authAdmin = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado.' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos de administrador.' });
    }

    req.admin = decoded; 
    next();
  } catch (error) {
    console.error('❌ Error en authAdmin:', error);
    res.status(400).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authAdmin;
