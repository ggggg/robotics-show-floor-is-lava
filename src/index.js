const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const net = require('net');
const Player = require('./Player');
const {
  colors, playerWidth, playerHeight, randint,
} = require('./utils');
const GameObject = require('./GameObject');
const state = require('./state');

const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.use(async (socket, next) => {
  socket.player = state.players[socket.id];
  next();
});
io.on('connection', (socket) => {
  // eslint-disable-next-line no-underscore-dangle
  if (socket.request._query.server) {
    socket.join('host');
    socket.on('startGame', (data) => {
      console.log('Starting game');
      state.gameStarted = true;
      state.canvasDim = data.canvasDim;
      state.islands = generateIslands();
    });
    socket.on('stopGame', () => {
      state.gameStarted = false;
    });
    console.log('host connected');
    socket.on('disconnect', () => {
      state.gameStarted = false;
      state.canvasDim = {};
      console.log('Host disconnected, game stopped');
    });
    return;
  }
  console.log(`A user just connected. We have ${Object.keys(state.players).length}${1} players`);
  if (!socket.player) {
    const newPlayer = new Player(
      socket,
      playerWidth,
      playerHeight,
      colors.find((x) => !Object.values(state.players).find((y) => y.color === x)),
    );
    state.players[socket.id] = newPlayer;
    socket.player = newPlayer;
    socket.emit('ehlo', newPlayer.data);
  }
  socket.on('disconnect', () => {
    console.log(`${state.players[socket.id].color} has disconnected`);
    delete state.players[socket.id];
  });
  socket.on('updateGyro', (data) => {
    socket.player.vx = data.gyroangleX;
    socket.player.vy = data.gyroangleY;
  });
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
  const client = net.connect({ port: 80, host: 'google.com' }, () => {
    console.log(`MyIP=${client.localAddress}`);
    console.log(`MyPORT=${client.localPort}`);
  });
});

const hrtimeMs = function () {
  const time = process.hrtime();
  return time[0] * 1000 + time[1] / 1000000;
};

const TICK_RATE = 20;
let tick = 0;
let previous = hrtimeMs();
const tickLengthMs = 1000 / TICK_RATE;

const generateIslands = () => {
  const w = randint(playerWidth + 5, state.canvasDim.width / 2);
  const h = randint(playerHeight + 5, state.canvasDim.height / 2);
  const island = new GameObject(
    randint(0, state.canvasDim.width - w),
    randint(0, state.canvasDim.height - h),
    w,
    h,
  );
  return [island];
};

const loop = () => {
  setTimeout(loop, tickLengthMs);
  const now = hrtimeMs();
  const delta = (now - previous) / 1000;
  previous = now;
  if (!state.gameStarted) {
    return;
  }
  if (!state.lavaOn) {
    state.nextLava -= delta;
    if (state.nextLava <= 0) {
      state.lavaOn = true;
      io.emit('lavaon');
      setTimeout(() => {
        state.lavaOn = false;
        io.emit('lavaoff');
        state.islands = generateIslands();
        console.log(state.islands);
      }, 7000);
      state.nextLava = randint(5, 15);
    }
  } else {
    state.alivePlayers.forEach((x) => {
      if (!x.isSafe(state.islands)) {
        console.log(`${x.color} died`);
        x.dead = true;
        io.emit('dead', { color: x.color });
      }
    });
  }
  state.alivePlayers.forEach((x) => x.update());
  io.in('host').emit('updateGame', { ...state, alivePlayers: undefined, players: state.alivePlayers.map((x) => x.data) });
  // game.update(delta, tick) // game logic would go here
  tick++;
};

loop(); // starts the loop
