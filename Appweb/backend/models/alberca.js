const mongoose = require('mongoose');

const AlbercaSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  waterLevel: { type: Number, required: true },
  climate: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Alberca', AlbercaSchema);
