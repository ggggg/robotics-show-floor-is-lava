module.exports = {
  nextLava: 10,
  lavaOn: false,
  gameStarted: false,
  islands: [],
  players: {},
  canvasDim: { width: 0, height: 0 },
  reset() {
    this.gameStarted = false;
    this.lavaOn = false;
    this.nextLava = 10;
    this.islands = [];
    Object.values(this.players).forEach((x) => {
      x.dead = false;
      x.reset();
    });
  },
  get alivePlayers() {
    return Object.values(this.players).filter((x) => !x.dead);
  },
  get playerData() {
    return Object.values(this.players).map((x) => x.data);
  },
};
