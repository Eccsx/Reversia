import { cloneDeep } from '../lib/lodash.clonedeep.js';

// https://youtu.be/l-hh51ncgDI
export function minimax(game, depth, maximazingBlack) {
    // No move left or win or draw
    if (depth == 0 || game.isVictory()) {
        return evaluatePosition(game, maximazingBlack);
    }

    // Legal moves
    const legals = Object.keys(game.sandwiches);

    if (maximazingBlack) {
        let maxEval = -Infinity;

        // Play each legal moves and compared their evaluation
        legals.forEach(legal => {
            // Clone game board
            const gameChild = cloneDeep(game);
            gameChild.sandwiches = structuredClone(game.sandwiches);

            // Play move
            gameChild.placePiece(legal);

            // Compare evaluation
            const childEval = minimax(gameChild, depth - 1, false);
            maxEval = Math.max(maxEval, childEval);
        });

        return maxEval;
    } else {
        let minEval = Infinity;

        // Play each legal moves and compared their evaluation
        legals.forEach(legal => {
            // Copy game board
            const gameChild = cloneDeep(game);
            gameChild.sandwiches = structuredClone(game.sandwiches);

            // Play move
            gameChild.placePiece(legal);

            // Compare evaluation
            const childEval = minimax(gameChild, depth - 1, true);
            minEval = Math.min(minEval, childEval);
        });

        return minEval;
    }

}

function evaluatePosition(game, maximazingBlack) {
    // Ration of pieces
    const blackCount = game.blackPiecesCount;
    const whiteCount = game.whitePiecesCount;

    if (maximazingBlack) {
        return blackCount / whiteCount;
    } else {
        return whiteCount / blackCount;
    }
}