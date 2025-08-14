const mongoose = require('mongoose');

const registroIotSchema = new mongoose.Schema({
  clase: { type: mongoose.Schema.Types.ObjectId, ref: 'Clase', required: true },
  temperatura: Number,
  humedad: Number,
  nivelAgua: Number,
  tempAgua: Number, 
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RegistroIot', registroIotSchema);
