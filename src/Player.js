const GameObject = require('./GameObject');
const { clamp } = require('./utils');
const state = require('./state');
const { CircularGameObject } = require('./GameObject');

class Player extends CircularGameObject {
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

  update(delta) {
    const speed = 2 * delta;
    this.y = clamp(this.y + speed * this.vy, 0, state.canvasDim.height - this.height);
    this.x = clamp(this.x + speed * this.vx, 0, state.canvasDim.width - this.width);
  }

  isSafe(islands) {
    return islands.some((x) => this.isSafe(x));
    // return this.corners.every(
    //   (x) => islands.some(
    //     (island) => x.inRect(island),
    //   ),
    // );
  }
}

module.exports = Player;
