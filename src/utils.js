const colors = [
  'red',
  'blue',
  'green',
  'orange',
  'purple',
  'pink',
  'brown',
  'cyan',
];

const playerWidth = 100;
const playerHeight = 100;

module.exports = {
  colors,
  playerWidth,
  playerHeight,
  clamp: (num, min, max) => Math.min(Math.max(num, min), max),
  randint: (min, max) => Math.floor(min + Math.random() * ((max - min) + 1)),
  approximatelyEqual: (v1, v2, epsilon = 0.001) => Math.abs(v1 - v2) < epsilon,
};
