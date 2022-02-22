// https://youtu.be/l-hh51ncgDI
export class Minimax {
    constructor(game, depth) {
        this.game = game;
        this.depth = depth;
    }

    think() {
        const legalMoves = Object.keys(this.game.sandwiches)
        const results = {};

        legalMoves.forEach(move => {
            const gameClone = this.game.clone();
            gameClone.placePiece(move);

            const moveEval = this.minimax(gameClone, this.depth, true);
            results[move] = moveEval;
        });

        return results;
    }

    minimax(game, depth, maximazingPlayer) {
        // No move left or win or draw
        if (depth == 0 || game.isVictory()) {
            return this.evaluatePosition(game, maximazingPlayer);
        }

        // Legal moves
        const legals = Object.keys(game.sandwiches);

        if (maximazingPlayer) {
            let maxEval = -Infinity;

            // Play each legal moves and compared their evaluation
            legals.forEach(legal => {
                // Clone game board
                const gameChild = game.clone();

                // Play move
                gameChild.placePiece(legal);

                // Compare evaluation
                const childEval = this.minimax(gameChild, depth - 1, false);
                maxEval = Math.max(maxEval, childEval);
            });

            return maxEval;
        } else {
            let minEval = Infinity;

            // Play each legal moves and compared their evaluation
            legals.forEach(legal => {
                // Copy game board
                const gameChild = game.clone();

                // Play move
                gameChild.placePiece(legal);

                // Compare evaluation
                const childEval = this.minimax(gameChild, depth - 1, true);
                minEval = Math.min(minEval, childEval);
            });

            return minEval;
        }
    }

    // If the value is positive --> Black advantage
    // If the value is negative --> White advantage
    evaluatePosition(game) {
        // Ration of pieces
        const blackCount = game.blackPiecesCount;
        const whiteCount = game.whitePiecesCount;

        if (blackCount >= whiteCount) {
            return blackCount / whiteCount;
        } else {
            return -whiteCount / blackCount;
        }
    }
}