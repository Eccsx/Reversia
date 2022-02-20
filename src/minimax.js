// https://youtu.be/l-hh51ncgDI

export default function minimax(game, depth, maximazingBlack) {
    // No move left or win or draw
    if (depth == 0 || game.isVictory()) {
        return evaluatePosition(game, maximazingBlack);
    }

    if (maximazingBlack) {
        let maxEval = -Infinity;

        // Legal moves
        const legals = game.getAllLegalMoves(1);

        // Play each legal moves and compared their evaluation
        legals.forEach(legal => {
            // Copy game board
            const gameChild = Object.assign(
                Object.create(Object.getPrototypeOf(game)),
                game
            );

            // Play move

            // Compare evaluation
            const childEval = minimax(gameChild, depth - 1, false);
            maxEval = Math.max(maxEval, childEval);

            return maxEval;
        });
    } else {
        let minEval = Infinity;

        // Legal moves
        const legals = game.getAllLegalMoves(2);

        // Play each legal moves and compared their evaluation
        legals.forEach(legal => {
            // Copy game board
            const gameChild = Object.assign(
                Object.create(Object.getPrototypeOf(game)),
                game
            );

            // Play move

            // Compare evaluation
            const childEval = minimax(gameChild, depth - 1, true);
            minEval = Math.min(minEval, childEval);

            return minEval;
        });
    }

}

function evaluatePosition(game, maximazingBlack) {
    // Ration of pieces
    const blackCount = game.blackPiecesCount;
    const whiteCount = game.whitePiecesCount;

    console.log(blackCount, whiteCount);

    if (maximazingBlack) {
        return blackCount / whiteCount;
    } else {
        return whiteCount / blackCount;
    }
}