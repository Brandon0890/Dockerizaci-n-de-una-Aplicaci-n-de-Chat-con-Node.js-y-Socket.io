const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Objeto para almacenar el mapeo entre ID de cliente y nombres de usuario
const clientNames = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  // Generar un ID único para el cliente
  const clientId = socket.id;

  // Asociar un nombre de usuario al ID de cliente
  clientNames[clientId] = `Usuario-${Object.keys(clientNames).length + 1}`;

  // Notificar a todos los clientes sobre el nuevo usuario
  io.emit('user_connected', {
    clientId,
    username: clientNames[clientId]
  });

  socket.on('message', (message) => {
    console.log('Message received:', message);
    io.emit('message', {
      clientId,
      username: clientNames[clientId],
      text: message
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Eliminar al cliente desconectado del mapeo
    delete clientNames[clientId];
    // Notificar a todos los clientes sobre la desconexión del usuario
    io.emit('user_disconnected', clientId);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
