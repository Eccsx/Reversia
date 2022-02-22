import {
    GameGraphics
} from './game.graphics.js';
import { Game } from './game.js';

const game = new GameGraphics();


// * TEST

console.log(game)

game.enableStrategyLayout();

// res -> https://www.worldothello.org/ratings/player?searchPlayerInput=SCHOTTE+Tom
// const match = 'e6f4c3c4d3d6f6c6f5g5g6e3f2d2h5e7d7e8e2f3g4g3h4e1c5b3c7b8c1d1f1c2b4b2a1b1g2b6a4f7c8d8a3h2h3h6a7a6a5h1g1a2b5a8f8g8h7h8g7b7';
// const matchWhite = 'd3e3f3c5c6c3b6b5a4c7b2a6f6f5a7a8b7a5c8b8g6a3c4d8e6d7e2e1d6b4f2c2b3a2a1b1c1d1f7f8d2f1g1e7e8f4g8g7g5';
// game.loadTranscript(match);

// game.loadTranscript('e6f4e3f6g5d6e7f5c5');