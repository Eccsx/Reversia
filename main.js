import Game from './game.js';

const game = new Game();

// * TEST

console.log(game);

const black = 1;
const white = 2;


game.placePiece("d3", black);
game.placePiece("e3", white);
game.placePiece("f4", white);
game.state = 1;

game.displayLegalMoves();