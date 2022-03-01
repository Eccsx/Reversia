// https://html.spec.whatwg.org/#module-worker-example
import Game from './game.js';
import Minimax from './minimax.js';

onmessage = (event) => {
  // Retrieve game instance
  const game = event.data.gameClone;
  Object.setPrototypeOf(game, Game.prototype);

  // Evalute moves
  const minimax = new Minimax(game, event.data.depth, event.data.isMaximizingBlack);
  const results = minimax.think();

  postMessage(results);
};
