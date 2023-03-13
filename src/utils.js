const colors = [
  'red',
  'blue',
  'green',
  'yellow',
  'orange',
  'purple',
  'pink',
  'brown',
  'cyan',
];

const playerWidth = 30;
const playerHeight = 30;

module.exports = {
  colors,
  playerWidth,
  playerHeight,
  clamp: (num, min, max) => Math.min(Math.max(num, min), max),
  randint: (min, max) => Math.floor(min + Math.random() * (max + 1)),
};
