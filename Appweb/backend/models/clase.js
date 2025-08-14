const mongoose = require('mongoose');

const ClaseSchema = new mongoose.Schema({
  codigoClase: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  maestro: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesor', required: true },
  alumnos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumno'
    }
  ],
  dias: {
    type: [String],
    enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    required: true
  },
  hora: { type: String, required: true },
  fechaInicio: { type: Date, required: true },
  fechaFin: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        
        if (!this.fechaInicio) return true;

        const unMesDespues = new Date(this.fechaInicio);
        unMesDespues.setMonth(unMesDespues.getMonth() + 1);
        return value <= unMesDespues;
      },
      message: 'La clase no puede durar más de 1 mes.'
    }
  }
});

ClaseSchema.pre('save', function (next) {
  if (!this.isModified('alumnos')) return next();

  if (this.alumnos.length > 10) {
    return next(new Error('No se pueden asignar más de 10 alumnos a esta clase.'));
  }
  if (this.alumnos.length < 1) {
    return next(new Error('Debe haber al menos 1 alumno en la clase.'));
  }

  next();
});

module.exports = mongoose.model('Clase', ClaseSchema);
