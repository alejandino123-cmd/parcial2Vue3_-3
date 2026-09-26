const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarContacto(req, res) {
  const { email, mensaje } = req.body;

  if (!email || !mensaje) {
    return res.status(400).json({ ok: false, mensaje: 'Email y mensaje son obligatorios' });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_DESTINO,
      replyTo: email,
      subject: 'Nuevo mensaje de contacto',
      text: `De: ${email}\n\nMensaje:\n${mensaje}`,
    });

    res.json({ ok: true, mensaje: 'Correo enviado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error al enviar el correo' });
  }
}

module.exports = { enviarContacto };
