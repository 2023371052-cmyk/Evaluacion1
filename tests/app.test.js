const request = require('supertest');
const app = require('../src/index');

describe('Pruebas de la API REST', () => {
  
  it('GET /api/health debe retornar estado OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'OK - Actualizado en vivo');
  });

  it('GET /api/users debe retornar la lista de usuarios', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('GET /api/users/:id debe retornar un usuario existente', async () => {
    const res = await request(app).get('/api/users/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('GET /api/users/:id debe retornar 404 si el usuario no existe', async () => {
    const res = await request(app).get('/api/users/999');
    expect(res.statusCode).toEqual(404);
  });

  it('POST /api/users debe crear un usuario nuevo', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Sofia Perez', email: 'sofia@example.com' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toEqual('Sofia Perez');
  });

  it('POST /api/users debe fallar si faltan datos', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Incompleto' });
    expect(res.statusCode).toEqual(400);
  });

  it('PUT /api/users/:id debe actualizar un usuario', async () => {
    const res = await request(app)
      .put('/api/users/1')
      .send({ name: 'Ana Gómez Actualizada', email: 'ana.nueva@example.com' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Ana Gómez Actualizada');
  });

  it('PUT /api/users/:id debe retornar 404 si el usuario a actualizar no existe', async () => {
    const res = await request(app)
      .put('/api/users/999')
      .send({ name: 'Nadie', email: 'nadie@example.com' });
    expect(res.statusCode).toEqual(404);
  });

  it('DELETE /api/users/:id debe eliminar un usuario', async () => {
    const res = await request(app).delete('/api/users/2');
    expect(res.statusCode).toEqual(200);
  });

  it('DELETE /api/users/:id debe retornar 404 si el usuario a eliminar no existe', async () => {
    const res = await request(app).delete('/api/users/999');
    expect(res.statusCode).toEqual(404);
  });

});