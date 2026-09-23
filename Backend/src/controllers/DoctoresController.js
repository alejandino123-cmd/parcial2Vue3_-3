const Doctor = require('../models/Doctor');

exports.listar = async (req, res) => res.json(await Doctor.find());

exports.obtener = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ mensaje: 'Doctor no encontrado' });
  res.json(doctor);
};

exports.crear = async (req, res) => res.status(201).json(await Doctor.create(req.body));

exports.actualizar = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doctor) return res.status(404).json({ mensaje: 'Doctor no encontrado' });
  res.json(doctor);
};

exports.eliminar = async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) return res.status(404).json({ mensaje: 'Doctor no encontrado' });
  res.status(204).send();
};