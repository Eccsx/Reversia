import Game from './game.js';

const game = new Game();

// * TEST

console.log(game);

const black = 1;
const white = 2;

console.log(game.surroundingCells);

game.placePiece("d3", black);

console.log(game.surroundingCells);