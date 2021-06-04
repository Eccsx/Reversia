const STATE = {
  'BLACK_TURN': 0,
  'WHITE_TURN': 1,
  'WIN': 2,
  'NO_MOVE': 3
}

const BOARD_LENGTH = 8;

const BLACK_PIECE = {
  value: 1,
  element: document.createElement('div')
}

const WHITE_PIECE = {
  value: 2,
  element: document.createElement('div')
}

export default class Game {
  constructor() {
    this.resetGame();
  }

  resetGame() {
    // setup pieces element
    BLACK_PIECE.element.classList.add('black-piece')
    WHITE_PIECE.element.classList.add('white-piece')

    // clean board
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

    document.getElementById('e4').appendChild(BLACK_PIECE.element.cloneNode());
    document.getElementById('d5').appendChild(BLACK_PIECE.element.cloneNode());
    document.getElementById('e5').appendChild(WHITE_PIECE.element.cloneNode());
    document.getElementById('d4').appendChild(WHITE_PIECE.element.cloneNode());

    // surrounding cells
    this.surroundingCells = new Set([
      'c3', 'c4', 'c5', 'c6',
      'd3', 'd6',
      'e3', 'e6',
      'f3', 'f4', 'f5', 'f6'
    ]);

    // set turn to black
    this.state = STATE.BLACK_TURN;

    // show first legal moves
    this.displayLegalMoves();
  }

  placePiece(cell) {
    // retrieve cell element
    const cellElement = document.getElementById(cell);

    // remove all inside element
    this.cleanCell(cellElement);

    // add piece
    if (this.state == STATE.BLACK_TURN) {
      cellElement.appendChild(BLACK_PIECE.element.cloneNode());
    } else {
      cellElement.appendChild(WHITE_PIECE.element.cloneNode());
    }

    // update board
    const index = this.cellToIndex(cell);
    this.board[index[0]][index[1]] =
      (this.state == STATE.BLACK_TURN) ? BLACK_PIECE.value : WHITE_PIECE.value;

    // update surrounding cells
    this.surroundingCells.delete(cell);
    for (const surroundingCell of this.getCellEmptyNeighbors(cell)) {
      this.surroundingCells.add(surroundingCell);
    }

    // switch player turn
    this.state = (this.state == STATE.BLACK_TURN) ? STATE.WHITE_TURN : STATE.BLACK_TURN;

    // update move indicators
    this.displayLegalMoves();

    // ! DEBUG
    console.log(this.surroundingCells);
  }

  getCellEmptyNeighbors(cell) {
    // retrieved cell grid indexes
    const cellIndex = this.cellToIndex(cell);
    const i = parseInt(cellIndex[0]);
    const j = parseInt(cellIndex[1]);

    const neighbors = [];

    // loop through neighbors
    // optimization → https://stackoverflow.com/a/67758639
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (!(x == 0 && y == 0)) {
          const nX = i + x;
          const nY = j + y;

          if ((nX >= 0 && nX < BOARD_LENGTH) && (nY >= 0 && nY < BOARD_LENGTH)) {
            // check if cell is empty
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
    // retrieved letter code and number
    const letterCode = cell[0].charCodeAt(0);
    const number = cell[1];

    return [number - 1, letterCode % 97];
  }

  cleanCell(cell) {
    cell.classList.remove('legal');
    cell.textContent = null;
    cell.onmousedown = null;
  }

  getAllLegalMoves(pieceValue) {
    const legalMoves = [];
    for (const cell of this.surroundingCells) {
      if (this.isCellLegalMove(cell, pieceValue)) {
        legalMoves.push(cell);
      }
    }
    return legalMoves;
  }

  isCellLegalMove(cell, pieceValue) {
    // retrieved cell grid indexes
    const cellIndex = this.cellToIndex(cell);
    const i = parseInt(cellIndex[0]);
    const j = parseInt(cellIndex[1]);

    const neighbors = [];

    console.log("-------------------");
    console.log(cell + ": " + cellIndex);

    // loop through neighbors
    // optimization → https://stackoverflow.com/a/67758639
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (!(x == 0 && y == 0)) {
          const nX = i + x;
          const nY = j + y;

          console.log(" " + nX + " " + nY + " -> " + this.indexToCell(nX, nY));

          if ((nX >= 0 && nX < BOARD_LENGTH) && (nY >= 0 && nY < BOARD_LENGTH)) {
            // check if opposite color piece
            const v = this.board[nX][nY];
            if (v != 0 && v != pieceValue) {
              // check if a sandwich is possible
              if (this.isSandwich(cellIndex, pieceValue, [x, y])) {
                console.log(" valid");
                return true
              }
            }
          }
        }
      }
    }
    console.log(" non-valid");
    return false;
  }

  isSandwich(cellIndex, pieceValue, direction) {
    const nextPiecesIndexes = this.getAllPiecesIndexesTowards(cellIndex, direction);

    console.log(" toward dir: " + direction + " -> " + this.indexToCell(cellIndex[0] + direction[0], cellIndex[1] + direction[1]))
    console.log(" toward: " + nextPiecesIndexes);

    // loop through until same color piece
    for (const pieceIndex of nextPiecesIndexes) {
      if (this.board[pieceIndex[0]][pieceIndex[1]] == pieceValue) {
        return true;
      }
    }

    return false;
  }

  getAllPiecesIndexesTowards(cellIndex, direction) {
    let i = cellIndex[0];
    let j = cellIndex[1];

    const dX = direction[0];
    const dY = direction[1];

    const cellsIndexes = [];

    console.log("  " + this.indexToCell(i, j) + " [" + dX + "," + dY + "]");
    console.log("  start: " + i + " " + j);

    console.log(" 0 < " + i + " < " + BOARD_LENGTH);
    console.log(" 0 < " + j + " < " + BOARD_LENGTH);

    let c = 0;
    // step forward until its reach border
    while (
      (0 <= (i += dX) && i < BOARD_LENGTH) &&
      (0 <= (j += dY) && j < BOARD_LENGTH)
    ) {

      console.log("  step " + c++ + ": " + i + " " + j);
      console.log(" 0 < " + i + " < " + BOARD_LENGTH);
      console.log(" 0 < " + j + " < " + BOARD_LENGTH);
      const cI = (0 < i && i < BOARD_LENGTH);
      const cJ = (0 < j && j < BOARD_LENGTH);
      // console.log("   cond i: " + cI);
      // console.log("   cond j: " + cJ);
      console.log("   cond &: " + (cI && cJ));

      // check cell has a piece
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

    const pieceValue = (this.state == STATE.BLACK_TURN) ? BLACK_PIECE.value : WHITE_PIECE.value;
    const legalMoves = this.getAllLegalMoves(pieceValue);

    for (const legalMove of legalMoves) {
      // move indicator
      const moveIndicator = document.createElement('div');
      moveIndicator.className = 'move-indicator';

      // phantom piece
      const phantomPiece = document.createElement('div');
      phantomPiece.className = (pieceValue == BLACK_PIECE.value) ? 'phantom-black-piece' : 'phantom-white-piece';

      // add element to cell
      const cell = document.getElementById(legalMove);
      cell.classList.add('legal');
      cell.appendChild(moveIndicator);
      cell.append(phantomPiece);

      // allow cell to place piece
      cell.onmousedown = () => {
        this.placePiece(legalMove)
      };
    }
  }

  cleanPreviousLegalMoves() {
    const previousLegalMoves = document.getElementsByClassName('legal');

    // solve for..of issue
    // res -> https://stackoverflow.com/a/39042507/11060940
    while (previousLegalMoves.length) {
      previousLegalMoves[0].textContent = null;
      previousLegalMoves[0].onmousedown = null;
      previousLegalMoves[0].classList.remove('legal');
    }
  }
}