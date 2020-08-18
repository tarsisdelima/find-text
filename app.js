const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// searches
const { Search, Page } = require('./search');
const searches = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('search', search => {
    if (!searches[search]) {
      searches[search] = new Search();
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => console.log('listening on *:3000'));

setInterval(_ => {
  const s = Object.keys(searches).map(s => searches[s]).find(s => s.searching);
  // continue: encontrar buscas para serem executadas
}, 5 * 1000);