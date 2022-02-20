import Game from './game.js';
import minimax from './minimax.js';

const game = new Game();

// * TEST

// game.enableStrategyLayout();

// res -> https://www.worldothello.org/ratings/player?searchPlayerInput=SCHOTTE+Tom
const match = 'e6f6f5d6c6e3f3c5e7g5g4f7d7f4b4e8g3h4h3g6h5h6h7f2c3c4b3c7d2e2d3b6b5a5d1g2e1g1g7c1c2a4f8h8g8f1d8a3h1b1a1h2a7a6a2b2b7c8b8a8';

game.loadTranscript(match);

console.log(game);

// const boardEval = minimax(game, 2, true);
// console.log(boardEval);