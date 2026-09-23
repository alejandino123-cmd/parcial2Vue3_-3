const Cita = require('../models/Citas');

exports.listar = async (req, res) => {
  const citas = await Cita.find()
    .populate('paciente_id', 'nombre email telefono')
    .populate('doctor_id', 'nombre especialidad');
  res.json(citas);
};

exports.obtener = async (req, res) => {
  const cita = await Cita.findById(req.params.id)
    .populate('paciente_id', 'nombre email telefono')
    .populate('doctor_id', 'nombre especialidad');
  if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
  res.json(cita);
};

exports.crear = async (req, res) => {
  const { doctor_id, fecha_cita } = req.body;

  if (new Date(fecha_cita) < new Date()) {
    return res.status(422).json({ mensaje: 'La fecha de la cita no puede ser en el pasado' });
  }

  const choque = await Cita.findOne({ doctor_id, fecha_cita, estado: { $ne: 'cancelada' } });
  if (choque) return res.status(409).json({ mensaje: 'El doctor ya tiene una cita en ese horario' });

  res.status(201).json(await Cita.create(req.body));
};

exports.actualizar = async (req, res) => {
  if (req.body.fecha_cita && new Date(req.body.fecha_cita) < new Date()) {
    return res.status(422).json({ mensaje: 'La fecha de la cita no puede ser en el pasado' });
  }
  const cita = await Cita.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
  res.json(cita);
};

exports.eliminar = async (req, res) => {
  const cita = await Cita.findByIdAndDelete(req.params.id);
  if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
  res.status(204).send();
};