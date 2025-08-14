const mongoose = require('mongoose');

const AlumnoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: { type: Number, required: true },
  correo: { type: String, required: true, unique: true },
  direccion: { type: String, required: true },
  telefono: { type: String, required: true },
  esMenorEdad: { type: Boolean, required: true },
  padre: {
    nombre: { type: String, required: function () { return this.esMenorEdad; } },
    telefono: { type: String, required: function () { return this.esMenorEdad; } }
  },
  contraseña: { type: String, required: true },
  clase: { type: mongoose.Schema.Types.ObjectId, ref: 'Clase', }
});

module.exports = mongoose.model('Alumno', AlumnoSchema);
