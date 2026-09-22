const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    especialidad: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    cualificaciones: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);