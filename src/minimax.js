import StaticEvaluation from './static.evaluation.js';

// https://youtu.be/l-hh51ncgDI
export class Minimax {
  constructor(game, depth, isMaximizingBlack) {
    this.game = game;
    this.depth = depth;
    this.isMaximizingBlack = isMaximizingBlack;
  }

  think() {
    const legalMoves = Object.keys(this.game.sandwiches);
    const results = {};

    legalMoves.forEach(move => {
      const gameClone = this.game.clone();
      gameClone.placePiece(move);

      const moveEval = this.minimax(gameClone, this.depth, -Infinity, Infinity, true);
      results[move] = moveEval;
    });

    return results;
  }

  minimax(game, depth, alpha, beta, maximazingPlayer) {
    // No move left or win or draw
    if (depth == 0 || game.isVictory()) {
      return StaticEvaluation.staticEvaluation(game, this.isMaximizingBlack);
    }

    // Legal moves
    const legals = Object.keys(game.sandwiches);

    if (maximazingPlayer) {
      let maxEval = -Infinity;

      // Play each legal moves and compared their evaluation
      for (const legal of legals) {
        // Clone game board
        const gameChild = game.clone();

        // Play move
        gameChild.placePiece(legal);

        // Compare evaluation
        const childEval = this.minimax(gameChild, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, childEval);

        // Alpha pruning
        alpha = Math.max(alpha, eval);
        if (beta <= alpha) {
          break;
        }
      };

      return maxEval;
    } else {
      let minEval = Infinity;

      // Play each legal moves and compared their evaluation
      for (const legal of legals) {
        // Copy game board
        const gameChild = game.clone();

        // Play move
        gameChild.placePiece(legal);

        // Compare evaluation
        const childEval = this.minimax(gameChild, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, childEval);

        // Beta pruning
        beta = Math.min(beta, eval);
        if (alpha <= beta) break;
      };

      return minEval;
    }
  }
}