const Point = require('./Point');
const { randint } = require('./utils');

class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class RectangularGameObject extends GameObject {
  constructor(x, y, width, height) {
    super(x, y);
    this.width = width;
    this.height = height;
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

class CircularGameObject extends GameObject {
  constructor(x, y, radius) {
    super(x, y);
    this.radius = radius;
  }

  get center() {
    return new Point(this.x + this.radius, this.y + this.radius);
  }

  inRect(rect) {
    return rect.corners.every(
      (x) => (this.center.x - x.x) ** 2 + (this.center.y - x.y) ** 2 <= this.radius ** 2,
    );
  }
}

module.exports = { GameObject, CircularGameObject, RectangularGameObject };
