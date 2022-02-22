import {
    Game
} from "./game.js";

export class GameGraphics extends Game {
    constructor() {
        super();

        // Pieces element
        this.BLACK_PIECE['element'] = document.createElement('div');
        this.WHITE_PIECE['element'] = document.createElement('div');

        this.BLACK_PIECE.element.classList.add('black-piece');
        this.WHITE_PIECE.element.classList.add('white-piece');

        this.resetGraphics();
    }

    resetGraphics() {
        super.resetGame();

        // Diplay first pieces
        document.getElementById('e4').appendChild(this.BLACK_PIECE.element.cloneNode());
        document.getElementById('d5').appendChild(this.BLACK_PIECE.element.cloneNode());
        document.getElementById('e5').appendChild(this.WHITE_PIECE.element.cloneNode());
        document.getElementById('d4').appendChild(this.WHITE_PIECE.element.cloneNode());

        // Compute and show first legal moves
        this.displayLegalMoves();
    }

    placePiece(cell) {
        const cellsToUpdate = super.placePiece(cell);

        // Update graphics
        this.updateBoardElements(cellsToUpdate);
        this.displayLegalMoves();
    }

    updateBoardElements(cellsToUpdate) {
        cellsToUpdate.forEach(cell => {
            // Retrieve and clean cell element
            const cellElement = document.getElementById(cell);
            this.cleanCell(cellElement);

            // Update piece
            const pieceIndex = this.cellToIndex(cell);

            if (this.board[pieceIndex[0]][pieceIndex[1]] == 1) {
                cellElement.appendChild(this.BLACK_PIECE.element.cloneNode());
            } else if (this.board[pieceIndex[0]][pieceIndex[1]] == 2) {
                cellElement.appendChild(this.WHITE_PIECE.element.cloneNode());
            }
        });
    }

    cleanCell(cellElement) {
        cellElement.classList.remove('legal');
        cellElement.textContent = null;
        cellElement.onmousedown = null;
    }

    displayLegalMoves() {
        this.cleanPreviousLegalMoves();

        const pieceValue = (this.state == this.STATE.BLACK_TURN) ? this.BLACK_PIECE.value : this.WHITE_PIECE.value;
        const legalMoves = Object.keys(this.sandwiches);

        for (const legalMove of legalMoves) {
            // Move indicator
            const moveIndicator = document.createElement('div');
            moveIndicator.className = 'move-indicator';

            // Phantom piece
            const phantomPiece = document.createElement('div');
            phantomPiece.className = (pieceValue == this.BLACK_PIECE.value) ? 'phantom-black-piece' : 'phantom-white-piece';

            // Add element to cell
            const cell = document.getElementById(legalMove);
            cell.classList.add('legal');
            cell.appendChild(moveIndicator);
            cell.append(phantomPiece);

            // Allow cell to place piece
            cell.onmousedown = () => {
                this.placePiece(legalMove);

                // Check victory
                if (this.isVictory()) {
                    this.endGame()
                }
            };
        }
    }

    endGame() {
        this.cleanPreviousLegalMoves();
        return;
    }

    cleanPreviousLegalMoves() {
        const previousLegalMoves = document.getElementsByClassName('legal');

        // Solve for..of issue
        // Ressource -> https://stackoverflow.com/a/39042507/11060940
        while (previousLegalMoves.length) {
            previousLegalMoves[0].textContent = null;
            previousLegalMoves[0].onmousedown = null;
            previousLegalMoves[0].classList.remove('legal');
        }
    }

    loadTranscript(matchString) {
        this.resetGame();

        // Split string in segment of two characters
        for (const cell of matchString.match(/.{1,2}/g)) {
            this.placePiece(cell);
        }
    }

    enableStrategyLayout() {
        // Corner cells
        document.getElementById('a1').classList.add('corner');
        document.getElementById('a8').classList.add('corner');
        document.getElementById('h1').classList.add('corner');
        document.getElementById('h8').classList.add('corner');

        // Extremity cells
        document.getElementById('a2').classList.add('extremity');
        document.getElementById('a7').classList.add('extremity');
        document.getElementById('b1').classList.add('extremity');
        document.getElementById('b2').classList.add('extremity');
        document.getElementById('b7').classList.add('extremity');
        document.getElementById('b8').classList.add('extremity');
        document.getElementById('g1').classList.add('extremity');
        document.getElementById('g2').classList.add('extremity');
        document.getElementById('g7').classList.add('extremity');
        document.getElementById('g8').classList.add('extremity');
        document.getElementById('h2').classList.add('extremity');
        document.getElementById('h7').classList.add('extremity');

        // border cell
        document.getElementById('a3').classList.add('border');
        document.getElementById('a4').classList.add('border');
        document.getElementById('a5').classList.add('border');
        document.getElementById('a6').classList.add('border');
        document.getElementById('c1').classList.add('border');
        document.getElementById('c8').classList.add('border');
        document.getElementById('d1').classList.add('border');
        document.getElementById('d8').classList.add('border');
        document.getElementById('e1').classList.add('border');
        document.getElementById('e8').classList.add('border');
        document.getElementById('f1').classList.add('border');
        document.getElementById('f8').classList.add('border');
        document.getElementById('h3').classList.add('border');
        document.getElementById('h4').classList.add('border');
        document.getElementById('h5').classList.add('border');
        document.getElementById('h6').classList.add('border');
    }

    disableStrategyLayout() {
        // Corner cells
        document.getElementById('a1').classList.remove('corner');
        document.getElementById('a8').classList.remove('corner');
        document.getElementById('h1').classList.remove('corner');
        document.getElementById('h8').classList.remove('corner');

        // Extremity cells
        document.getElementById('a2').classList.remove('extremity');
        document.getElementById('a7').classList.remove('extremity');
        document.getElementById('b1').classList.remove('extremity');
        document.getElementById('b2').classList.remove('extremity');
        document.getElementById('b7').classList.remove('extremity');
        document.getElementById('b8').classList.remove('extremity');
        document.getElementById('g1').classList.remove('extremity');
        document.getElementById('g2').classList.remove('extremity');
        document.getElementById('g7').classList.remove('extremity');
        document.getElementById('g8').classList.remove('extremity');
        document.getElementById('h2').classList.remove('extremity');
        document.getElementById('h7').classList.remove('extremity');

        // Border cell
        document.getElementById('a3').classList.remove('border');
        document.getElementById('a4').classList.remove('border');
        document.getElementById('a5').classList.remove('border');
        document.getElementById('a6').classList.remove('border');
        document.getElementById('c1').classList.remove('border');
        document.getElementById('c8').classList.remove('border');
        document.getElementById('d1').classList.remove('border');
        document.getElementById('d8').classList.remove('border');
        document.getElementById('e1').classList.remove('border');
        document.getElementById('e8').classList.remove('border');
        document.getElementById('f1').classList.remove('border');
        document.getElementById('f8').classList.remove('border');
        document.getElementById('h3').classList.remove('border');
        document.getElementById('h4').classList.remove('border');
        document.getElementById('h5').classList.remove('border');
        document.getElementById('h6').classList.remove('border');
    }
}