const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema(
  {
    paciente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    fecha_cita: { type: Date, required: true },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
      default: 'pendiente',
    },
    notas: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cita', citaSchema);