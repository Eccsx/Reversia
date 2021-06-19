export default class Game {
  constructor() {
    // Board properties
    this.BOARD_LENGTH = 8;

    this.STATE = {
      'BLACK_TURN': 0,
      'WHITE_TURN': 1,
      'WIN_BLACK': 2,
      'WIN_WHITE': 3,
      'NO_MOVE': 4
    }

    this.previousNoMoveCount = 0;

    // Pieces
    this.BLACK_PIECE = {
      value: 1,
      element: document.createElement('div')
    }

    this.WHITE_PIECE = {
      value: 2,
      element: document.createElement('div')
    }

    this.BLACK_PIECE.element.classList.add('black-piece')
    this.WHITE_PIECE.element.classList.add('white-piece')

    // Initialize game
    this.resetGame();
  }

  resetGame() {
    // Clean board
    this.board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    document.getElementById('e4').appendChild(this.BLACK_PIECE.element.cloneNode());
    document.getElementById('d5').appendChild(this.BLACK_PIECE.element.cloneNode());
    document.getElementById('e5').appendChild(this.WHITE_PIECE.element.cloneNode());
    document.getElementById('d4').appendChild(this.WHITE_PIECE.element.cloneNode());

    // Piece counters
    this.blackPiecesCount = 2;
    this.whitePiecesCount = 2;

    // Surrounding cells
    this.surroundingCells = new Set([
      'c3', 'c4', 'c5', 'c6',
      'd3', 'd6',
      'e3', 'e6',
      'f3', 'f4', 'f5', 'f6'
    ]);

    // Set turn to Black
    this.state = this.STATE.BLACK_TURN;

    // All possibles sandwiches per legal move
    this.sandwiches = [];

    // Compute and show first legal moves
    this.displayLegalMoves();
  }

  placePiece(cell) {
    // Retrieve cell element
    const cellElement = document.getElementById(cell);

    // Remove all inside element
    this.cleanCell(cellElement);

    // Add piece element
    if (this.state == this.STATE.BLACK_TURN) {
      cellElement.appendChild(this.BLACK_PIECE.element.cloneNode());
      this.blackPiecesCount++;
    } else {
      cellElement.appendChild(this.WHITE_PIECE.element.cloneNode());
      this.whitePiecesCount++;
    }

    // Flip pieces in sandwich
    for (const piece of this.sandwiches[cell]) {
      const pieceElement = document.getElementById(piece);
      const pieceIndex = this.cellToIndex(piece);

      this.cleanCell(pieceElement);

      if (this.state == this.STATE.BLACK_TURN) {
        pieceElement.appendChild(this.BLACK_PIECE.element.cloneNode());
        this.board[pieceIndex[0]][pieceIndex[1]] = this.BLACK_PIECE.value;

        // Update piece counters
        this.blackPiecesCount++;
        this.whitePiecesCount--;
      } else {
        pieceElement.appendChild(this.WHITE_PIECE.element.cloneNode());
        this.board[pieceIndex[0]][pieceIndex[1]] = this.WHITE_PIECE.value;

        // Update piece counters
        this.whitePiecesCount++;
        this.blackPiecesCount--;
      }
    }

    // Add piece value in board
    const index = this.cellToIndex(cell);
    this.board[index[0]][index[1]] =
      (this.state == this.STATE.BLACK_TURN) ? this.BLACK_PIECE.value : this.WHITE_PIECE.value;

    // Check victory
    if (this.isVictory()) {
      this.endGame();
      return;
    }

    // Update surrounding cells
    this.surroundingCells.delete(cell);
    for (const surroundingCell of this.getCellEmptyNeighbors(cell)) {
      this.surroundingCells.add(surroundingCell);
    }

    // Switch player turn
    this.state = (this.state == this.STATE.BLACK_TURN) ? this.STATE.WHITE_TURN : this.STATE.BLACK_TURN;

    // Update legal moves and sandwiches
    this.displayLegalMoves();

    // Check draw
    this.checkDraw();
  }

  endGame() {
    this.cleanPreviousLegalMoves();
    console.log("Victory " + ((this.state == this.STATE.WIN_BLACK) ? "BLACK" : "WHITE"));
    return
  }

  checkDraw() {
    if (this.previousNoMoveCount == 2) {
      this.endGame();
      return;
    } else if (this.sandwiches.length == 0) {
      this.previousNoMoveCount++;

      // Switch player turn
      this.state = (this.state == this.STATE.BLACK_TURN) ? this.STATE.WHITE_TURN : this.STATE.BLACK_TURN;

      // Update legal moves and sandwiches
      this.displayLegalMoves();

      // Recursion
      this.checkDraw();
    } else {
      this.previousNoMoveCount = 0;
    }
  }

  isVictory() {
    // White
    if (this.blackPiecesCount == 0) {
      this.state = this.STATE.WIN_WHITE;
      return true;
    }

    // Black
    if (this.whitePiecesCount == 0) {
      this.state = this.STATE.WIN_BLACK;
      return true;
    }

    // Draw
    if ((this.blackPiecesCount + this.whitePiecesCount) == 64) {
      this.state = (this.blackPiecesCount > this.whitePiecesCount) ? this.STATE.WIN_BLACK : this.STATE.WIN_WHITE;
      return true;
    }

    return false;
  }

  getCellEmptyNeighbors(cell) {
    // Retrieve cell grid indexes
    const cellIndex = this.cellToIndex(cell);
    const i = parseInt(cellIndex[0]);
    const j = parseInt(cellIndex[1]);

    const neighbors = [];

    // Loop through neighbors
    // Optimization → https://stackoverflow.com/a/67758639
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (!(x == 0 && y == 0)) {
          const nX = i + x;
          const nY = j + y;

          if ((nX >= 0 && nX < this.BOARD_LENGTH) && (nY >= 0 && nY < this.BOARD_LENGTH)) {
            // Check if cell is empty
            if (this.board[nX][nY] == 0) {
              neighbors.push(this.indexToCell(nX, nY));
            }
          }
        }
      }
    }

    return neighbors;
  }

  indexToCell(row, column) {
    return String.fromCharCode(97 + column) + (row + 1);
  }

  cellToIndex(cell) {
    // Retrieve letter code and number
    const letterCode = cell[0].charCodeAt(0);
    const number = cell[1];

    return [number - 1, letterCode % 97];
  }

  cleanCell(cellElement) {
    cellElement.classList.remove('legal');
    cellElement.textContent = null;
    cellElement.onmousedown = null;
  }

  getAllLegalMoves(pieceValue) {
    // Clean sandwiches array
    this.sandwiches = [];

    const legalMoves = [];
    for (const cell of this.surroundingCells) {
      if (this.isCellLegalMove(cell, pieceValue)) {
        legalMoves.push(cell);
      }
    }
    return legalMoves;
  }

  isCellLegalMove(cell, pieceValue) {
    // Retrieve cell grid indexes
    const cellIndex = this.cellToIndex(cell);
    const i = parseInt(cellIndex[0]);
    const j = parseInt(cellIndex[1]);

    let isSandwich = false;
    const arraySandwiches = []

    // Loop through neighbors
    // Optimization → https://stackoverflow.com/a/67758639
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (!(x == 0 && y == 0)) {
          const nX = i + x;
          const nY = j + y;

          if ((nX >= 0 && nX < this.BOARD_LENGTH) && (nY >= 0 && nY < this.BOARD_LENGTH)) {
            // check if opposite color piece
            const v = this.board[nX][nY];
            if (v != 0 && v != pieceValue) {
              // check if sandwiches are possible
              const piecesInSandwich = this.getSandwich(cellIndex, pieceValue, [x, y]);
              if (piecesInSandwich != null) {
                arraySandwiches.push(piecesInSandwich);
                isSandwich = true;
              }
            }
          }
        }
      }
    }

    // Store sandwiches if any
    if (isSandwich) {
      // Avoid nested arrays
      this.sandwiches[cell] = arraySandwiches.flat();
      // Increment array length
      this.sandwiches.length++;
    }

    return isSandwich;
  }

  getSandwich(cellIndex, pieceValue, direction) {
    const nextPiecesIndexes = this.getAllPiecesIndexesTowards(cellIndex, direction);
    const piecesBetween = [];

    // Loop through until same color piece
    for (const pieceIndex of nextPiecesIndexes) {
      if (this.board[pieceIndex[0]][pieceIndex[1]] == pieceValue) {
        return piecesBetween;
      }
      piecesBetween.push(this.indexToCell(pieceIndex[0], pieceIndex[1]));
    }

    return null;
  }

  getAllPiecesIndexesTowards(cellIndex, direction) {
    let i = cellIndex[0];
    let j = cellIndex[1];

    const dX = direction[0];
    const dY = direction[1];

    const cellsIndexes = [];

    // Step forward until its reach border
    while (
      (0 <= (i += dX) && i < this.BOARD_LENGTH) &&
      (0 <= (j += dY) && j < this.BOARD_LENGTH)
    ) {
      // Check cell has a piece
      if (this.board[i][j] != 0) {
        cellsIndexes.push([i, j]);
      } else {
        break;
      }
    }

    return cellsIndexes;
  }

  displayLegalMoves() {
    this.cleanPreviousLegalMoves();

    const pieceValue = (this.state == this.STATE.BLACK_TURN) ? this.BLACK_PIECE.value : this.WHITE_PIECE.value;
    const legalMoves = this.getAllLegalMoves(pieceValue);

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
        this.placePiece(legalMove)
      };
    }
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