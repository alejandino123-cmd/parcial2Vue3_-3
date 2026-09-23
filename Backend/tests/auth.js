const request = require('supertest');
const app = require('../app');

test('registra un usuario y devuelve token', async () => {
  const res = await request(app).post('/api/register').send({
    nombre: 'Ale', email: 'ale@clinica.com', password: '123456',
  });
  expect(res.status).toBe(201);
  expect(res.body.token).toBeDefined();
});