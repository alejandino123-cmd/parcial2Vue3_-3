const Cita = require('../models/Citas');

exports.citasPorEstado = async (req, res) => {
  const resultado = await Cita.aggregate([
    { $group: { _id: '$estado', total: { $sum: 1 } } },
    { $project: { estado: '$_id', total: 1, _id: 0 } },
  ]);
  res.json(resultado);
};

exports.citasPorDoctor = async (req, res) => {
  const resultado = await Cita.aggregate([
    { $group: { _id: '$doctor_id', total: { $sum: 1 } } },
    { $lookup: { from: 'doctors', localField: '_id', foreignField: '_id', as: 'doctor' } },
    { $unwind: '$doctor' },
    { $project: { _id: 0, doctor_id: '$doctor._id', nombre: '$doctor.nombre', total_citas: '$total' } },
  ]);
  res.json(resultado);
};