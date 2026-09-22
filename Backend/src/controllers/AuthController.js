const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generarToken(usuario) {
  return jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

async function registro(req, res) {
  const { nombre, email, password, rol } = req.body;
  const existente = await User.findOne({ email });
  if (existente) return res.status(409).json({ mensaje: 'Ese email ya está registrado' });

  const usuario = await User.create({ nombre, email, password, rol });
  const token = generarToken(usuario);
  res.status(201).json({ usuario: { id: usuario._id, nombre, email, rol: usuario.rol }, token });
}

async function login(req, res) {
  const { email, password } = req.body;
  const usuario = await User.findOne({ email }).select('+password');
  if (!usuario || !(await usuario.compararPassword(password))) {
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }
  const token = generarToken(usuario);
  res.json({ usuario: { id: usuario._id, nombre: usuario.nombre, email, rol: usuario.rol }, token });
}

async function logout(req, res) {
  res.json({ mensaje: 'Sesión cerrada' }); // con JWT, el logout real lo hace el cliente descartando el token
}

module.exports = { registro, login, logout };