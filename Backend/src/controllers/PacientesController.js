const Paciente = require('../models/Paciente');

exports.listar = async (req, res) => res.json(await Paciente.find());
exports.obtener = async (req, res) => {
  const p = await Paciente.findById(req.params.id);
  if (!p) return res.status(404).json({ mensaje: 'Paciente no encontrado' });
  res.json(p);
};
exports.crear = async (req, res) => res.status(201).json(await Paciente.create(req.body));
exports.actualizar = async (req, res) => {
  const p = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!p) return res.status(404).json({ mensaje: 'Paciente no encontrado' });
  res.json(p);
};
exports.eliminar = async (req, res) => {
  const p = await Paciente.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ mensaje: 'Paciente no encontrado' });
  res.status(204).send();
};


const Cita = require('../models/Cita');

exports.crear = async (req, res) => {
  const { doctor_id, fecha_cita } = req.body;
  if (new Date(fecha_cita) < new Date()) {
    return res.status(422).json({ mensaje: 'La fecha no puede ser en el pasado' });
  }
  const choque = await Cita.findOne({ doctor_id, fecha_cita, estado: { $ne: 'cancelada' } });
  if (choque) return res.status(409).json({ mensaje: 'El doctor ya tiene una cita en ese horario' });

  res.status(201).json(await Cita.create(req.body));
};