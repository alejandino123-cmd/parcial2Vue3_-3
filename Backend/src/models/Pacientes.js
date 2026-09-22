const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    fecha_nacimiento: { type: Date, required: true },
    historial_medico: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Paciente', pacienteSchema);