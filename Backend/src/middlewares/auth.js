const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function autenticar(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findById(payload.id);
    if (!usuario) return res.status(401).json({ mensaje: 'Usuario no válido' });
    req.usuario = usuario;
    next();
  } catch {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

module.exports = autenticar;