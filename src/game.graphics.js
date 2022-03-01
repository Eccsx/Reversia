import Game from './game.js';

export default class GameGraphics extends Game {
  constructor() {
    super();

    // Pieces element
    this.BLACK_PIECE.element = document.createElement('div');
    this.WHITE_PIECE.element = document.createElement('div');
    this.BLACK_PIECE.element.classList.add('black-piece');
    this.WHITE_PIECE.element.classList.add('white-piece');

    // Phantom
    this.BLACK_PIECE.phantom = document.createElement('div');
    this.WHITE_PIECE.phantom = document.createElement('div');
    this.BLACK_PIECE.phantom.classList.add('phantom-black-piece');
    this.WHITE_PIECE.phantom.classList.add('phantom-white-piece');

    // Move indicator
    this.MOVE_INDICATOR = document.createElement('div');
    this.MOVE_INDICATOR.classList.add('move-indicator');

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
    // Add piece value in board
    const pieceValue = (this.state === this.STATE.BLACK_TURN)
      ? this.BLACK_PIECE.value
      : this.WHITE_PIECE.value;

    const index = Game.cellToIndex(cell);
    this.board[index[0]][index[1]] = pieceValue;

    // Update piece count
    if (this.state === this.STATE.BLACK_TURN) {
      this.blackPiecesCount += 1;
    } else {
      this.whitePiecesCount += 1;
    }

    // Cells element that will need to be updated
    const cellsToUpdate = [cell];

    // Flip pieces in sandwich
    this.sandwiches[cell].forEach((cellToSwitch) => {
      const pieceIndex = Game.cellToIndex(cellToSwitch);

      if (this.state === this.STATE.BLACK_TURN) {
        this.board[pieceIndex[0]][pieceIndex[1]] = this.BLACK_PIECE.value;

        // Update piece counters
        this.blackPiecesCount += 1;
        this.whitePiecesCount -= 1;
      } else {
        this.board[pieceIndex[0]][pieceIndex[1]] = this.WHITE_PIECE.value;

        // Update piece counters
        this.whitePiecesCount += 1;
        this.blackPiecesCount -= 1;
      }

      cellsToUpdate.push(cellToSwitch);
    });

    this.updateBoardElements(cellsToUpdate);

    // After-placement verifications
    if (this.isVictory()) {
      this.endGame();
      return;
    }

    // Next player to play
    this.updateSurroundingCell(cell);
    this.switchPlayerTurn();

    if (this.isNoMove()) {
      this.switchPlayerTurn();
      if (this.isNoMove()) {
        this.endGame();
      }
    }

    this.displayLegalMoves();
  }

  switchPlayerTurn() {
    super.switchPlayerTurn();
    this.displayLegalMoves();
  }

  updateBoardElements(cellsToUpdate) {
    cellsToUpdate.forEach((cell) => {
      // Retrieve and clean cell element
      const cellElement = document.getElementById(cell);
      GameGraphics.cleanCell(cellElement);

      // Update piece
      const pieceIndex = Game.cellToIndex(cell);

      if (this.board[pieceIndex[0]][pieceIndex[1]] === 1) {
        cellElement.appendChild(this.BLACK_PIECE.element.cloneNode());
      } else if (this.board[pieceIndex[0]][pieceIndex[1]] === 2) {
        cellElement.appendChild(this.WHITE_PIECE.element.cloneNode());
      }
    });
  }

  static cleanCell(cellElement) {
    const element = cellElement;
    element.classList.remove('legal');
    element.textContent = null;
    element.onmousedown = null;
  }

  displayLegalMoves() {
    GameGraphics.cleanPreviousLegalMoves();
    const legalMoves = Object.keys(this.sandwiches);

    legalMoves.forEach((legalMove) => {
      // Add element to cell
      const cell = document.getElementById(legalMove);
      cell.classList.add('legal');

      cell.appendChild(this.MOVE_INDICATOR.cloneNode());
      cell.append(
        (this.state === this.STATE.BLACK_TURN)
          ? this.BLACK_PIECE.phantom.cloneNode()
          : this.WHITE_PIECE.phantom.cloneNode(),
      );

      // Allow cell to place piece
      /* istanbul ignore next */
      cell.onmousedown = () => this.mouseAction(legalMove);
    });
  }

  mouseAction(move) {
    this.placePiece(move);
  }

  endGame() {
    super.endGame();
    GameGraphics.cleanPreviousLegalMoves();
  }

  static cleanPreviousLegalMoves() {
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
    matchString.match(/.{1,2}/g).forEach((cell) => {
      this.placePiece(cell);

      if (this.state === this.STATE.WIN_BLACK
        || this.state === this.STATE.WIN_WHITE
        || this.state === this.STATE.DRAW) {
        throw new Error('invalid move');
      }
    });
  }

  static enableStrategyLayout() {
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

    // Corder cells
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

  static disableStrategyLayout() {
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
