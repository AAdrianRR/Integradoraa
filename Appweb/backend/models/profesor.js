const mongoose = require('mongoose');

const ProfesorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true }, 
  contraseña: { type: String, required: true }
});

module.exports = mongoose.model('Profesor', ProfesorSchema);
