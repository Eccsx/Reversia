import Game from './game.js';

const game = new Game();

// * TEST

console.log(game);

const black = 1;
const white = 2;

// * console.log(game.cellCodeToIndex("c3"));

// -> 3,3 4,4
// console.log(game.getAllPiecesIndexesTowards([2, 2], [1, 1]));

console.log(game.isCellLegalMove("c3", black)); // FALSE
console.log(game.isCellLegalMove("a1", white)); // FALSE

console.log(game.isCellLegalMove("d3", black)); // TRUE
console.log(game.isCellLegalMove("d6", white)); // TRUE

// d3, c4, e6, f5
console.log(game.getAllLegalMoves(black));

// d6, c5, e3, f4
console.log(game.getAllLegalMoves(white));
