// https://html.spec.whatwg.org/#module-worker-example
import * as Game from './game';
import * as Minimax from './minimax';

onmessage = (event) => {
  // Retrieve game instance
  const game = event.data.gameClone;
  Object.setPrototypeOf(game, Game.Game.prototype);

  // Evalute moves
  const minimax = new Minimax.Minimax(game, event.data.depth, event.data.isMaximizingBlack);

  const results = minimax.think();

  postMessage(results);
};
