const express = require('express');
const app = express();
app.use(express.json());

// Simulación de base de datos en memoria
let users = [
  { id: 1, name: 'Ana Gómez', email: 'ana@example.com' },
  { id: 2, name: 'Carlos Ruiz', email: 'carlos@example.com' }
];

// 1. Endpoint de Salud (Health Check)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK - Actualizado en vivo', timestamp: new Date() });
});

// 2. Obtener todos los usuarios
app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

// 3. Obtener un usuario por ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.status(200).json(user);
});

// 4. Crear un nuevo usuario
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Nombre y email son obligatorios' });
  }
  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name,
    email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// 5. Actualizar un usuario
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;

  res.status(200).json(user);
});

// 6. Eliminar un usuario
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

  const deletedUser = users.splice(index, 1);
  res.status(200).json({ message: 'Usuario eliminado', user: deletedUser[0] });
});

// Exportar la app para que Jest pueda probarla sin levantar el puerto directamente
module.exports = app;

// Iniciar servidor solo si se ejecuta directamente
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}