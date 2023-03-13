const GameObject = require('./GameObject');
const { clamp } = require('./utils');
const state = require('./state');

class Player extends GameObject {
  constructor(socket, width, height, color) {
    super(0, 0, width, height);
    this.socket = socket;
    this.color = color;
    this.reset();
  }

  get data() {
    const temp = { ...this };
    delete temp.socket;
    return temp;
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.score = 0;
    this.vx = 0;
    this.vy = 0;
    this.dead = false;
  }

  update() {
    const speed = 0.1;
    this.y = clamp(this.y + speed * this.vy, 0, state.canvasDim.height - this.height);
    this.x = clamp(this.x + speed * this.vx, 0, state.canvasDim.width - this.width);
  }

  isSafe(islands) {
    console.log([
      [this.x, this.y],
      [this.x + this.width, this.y],
      [this.x, this.y + this.height],
      [this.x + this.width, this.y + this.height],
    ]);
    console.log(islands);
    return [
      [this.x, this.y],
      [this.x + this.width, this.y],
      [this.x, this.y + this.height],
      [this.x + this.width, this.y + this.height],
    ].every(
      (x) => islands.some(
        (island) => island.x <= x[0] && x[0] <= island.x + island.width
                    && island.y <= x[1] && x[1] <= island.y + island.height,
      ),
    );
  }
}

module.exports = Player;
