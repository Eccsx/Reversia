import {
    GameGraphics
} from "./game.graphics.js";
import {
    Minimax
} from "./minimax.js";

export class GameMinimax extends GameGraphics {
    constructor(depth, isMinimaxBlack) {
        super();

        this.minimax = new Minimax(this, depth);
        this.isMinimaxBlack = isMinimaxBlack;

        // Minimaxs play first
        if (isMinimaxBlack) {
            this.minimaxPlay();
        }
    }

    minimaxPlay() {
        // Evaluate legal moves
        const evals = this.minimax.think();

        // Play best move
        // https://stackoverflow.com/a/50723439/11060940
        const best = Object.entries(evals).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        this.placePiece(best);
    }


    // Override to allow minimax play
    mouseAction(move) {
        this.placePiece(move);

        // Check victory
        if (this.isVictory()) {
            this.endGame();
        }
        else {
            this.minimaxPlay();
        }
    }
}