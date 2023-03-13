module.exports = {
  nextLava: 10,
  lavaOn: false,
  gameStarted: false,
  islands: [],
  players: {},
  canvasDim: { width: 0, height: 0 },
  get alivePlayers() {
    return Object.values(this.players).filter((x) => !x.dead);
  },
};
