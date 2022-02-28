import StaticEvaluation from './static.evaluation';

// https://youtu.be/l-hh51ncgDI
export default class Minimax {
  constructor(game, depth, isMaximizingBlack) {
    this.game = game;
    this.depth = depth;
    this.isMaximizingBlack = isMaximizingBlack;
  }

  think() {
    const legalMoves = Object.keys(this.game.sandwiches);
    const results = {};

    legalMoves.forEach((move) => {
      const gameClone = this.game.clone();
      gameClone.placePiece(move);

      const moveEval = this.minimax(gameClone, this.depth, -Infinity, Infinity, true);
      results[move] = moveEval;
    });

    return results;
  }

  minimax(game, depth, alpha, beta, maximazingPlayer) {
    let Alpha = alpha;
    let Beta = beta;

    // No move left or win or draw
    if (depth === 0 || game.isVictory()) {
      return StaticEvaluation.staticEvaluation(game.clone(), this.isMaximizingBlack);
    }

    // Legal moves
    const legals = Object.keys(game.sandwiches);

    if (maximazingPlayer) {
      let maxEval = -Infinity;

      // Play each legal moves and compared their evaluation
      /* Disable lint cause forEach() don't allow to break */
      /* eslint-disable-next-line no-restricted-syntax */
      for (const legal of legals) {
        // Clone game board
        const gameChild = game.clone();

        // Play move
        gameChild.placePiece(legal);

        // Compare evaluation
        const childEval = this.minimax(gameChild, depth - 1, Alpha, Beta, false);
        maxEval = Math.max(maxEval, childEval);

        // Alpha pruning
        Alpha = Math.max(Alpha, childEval);
        if (Beta <= Alpha) {
          break;
        }
      }

      return maxEval;
    }

    let minEval = Infinity;

    // Play each legal moves and compared their evaluation
    /* Disable lint cause forEach() don't allow to break */
    /* eslint-disable-next-line no-restricted-syntax */
    for (const legal of legals) {
      // Copy game board
      const gameChild = game.clone();

      // Play move
      gameChild.placePiece(legal);

      // Compare evaluation
      const childEval = this.minimax(gameChild, depth - 1, Alpha, Beta, true);
      minEval = Math.min(minEval, childEval);

      // Beta pruning
      Beta = Math.min(Beta, childEval);
      if (Alpha <= Beta) break;
    }

    return minEval;
  }
}
