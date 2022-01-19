import Game from './game.js';

const game = new Game();

// * TEST

// game.enableStrategyLayout();

// res -> https://www.worldothello.org/ratings/player?searchPlayerInput=SCHOTTE+Tom
const match = 'f5f6e6f4e3c5g5g3g4f3e2h6c4d6h5h4e7f2g6f7d3c6d2h3d7b3b4c8d8c3b6e8b5c7f1c2a3b2f8g8a1a2b7e1d1c1h7h8g7a8b1a6g1g2a5a7b8a4h1h2';

game.loadTranscript(match);

console.log(game);