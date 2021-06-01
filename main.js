import Game from './game.js';

const game = new Game();

console.log(game);

const black = 1;
const white = 2;

console.log(game.getCellOppositeNeighbors("e5", white)); // --> d5, e4
console.log(game.getCellOppositeNeighbors("e4", black)); // --> d4, e5
console.log(game.getCellOppositeNeighbors("a1", white)); // --> []

console.log(game.cellCodeToIndex("e5")); // --> 4, 4
console.log(game.cellCodeToIndex("f5")); // --> 4, 5