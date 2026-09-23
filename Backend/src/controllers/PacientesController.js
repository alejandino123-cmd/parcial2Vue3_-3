const Paciente = require('../models/Pacientes');

exports.listar = async (req, res) => res.json(await Paciente.find());

exports.obtener = async (req, res) => {
  const paciente = await Paciente.findById(req.params.id);
  if (!paciente) return res.status(404).json({ mensaje: 'Paciente no encontrado' });
  res.json(paciente);
};

exports.crear = async (req, res) => res.status(201).json(await Paciente.create(req.body));

exports.actualizar = async (req, res) => {
  const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!paciente) return res.status(404).json({ mensaje: 'Paciente no encontrado' });
  res.json(paciente);
};

exports.eliminar = async (req, res) => {
  const paciente = await Paciente.findByIdAndDelete(req.params.id);
  if (!paciente) return res.status(404).json({ mensaje: 'Paciente no encontrado' });
  res.status(204).send();
};