const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3001 });

server.on('connection', socket => {
  console.log('New client connected');
  
  socket.on('message', message => {
    console.log(`Received message: ${message}`);
    socket.send(`Echo: ${message}`);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is listening on ws://localhost:3001');
