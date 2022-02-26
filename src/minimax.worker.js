// https://html.spec.whatwg.org/#module-worker-example
import * as Game from "./game.js";
import * as Minimax from "./minimax.js"

onmessage = (event) => {
    // Retrieve game instance
    const game = event.data.gameClone;
    Object.setPrototypeOf(game, Game.Game.prototype);

    // Evalute moves
    const minimax = new Minimax.Minimax(game, event.data.depth);

    const results = minimax.think();

    postMessage(results);
}