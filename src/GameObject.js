const Point = require('./Point');

class GameObject {
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  get corners() {
    return [
      [this.x, this.y],
      [this.x + this.width, this.y],
      [this.x, this.y + this.height],
      [this.x + this.width, this.y + this.height],
    ].map(([x, y]) => new Point(x, y));
  }
}

module.exports = GameObject;
