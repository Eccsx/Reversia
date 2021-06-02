const State = {
  'BLACK_TURN': 0,
  'WHITE_TURN': 1,
  'WIN': 2,
  'NO_MOVE': 3
}

const BOARD_LENGTH = 8;

const BLACK_PIECE_VALUE = 1;
const WHITE_PIECE_VALUE = 2;

export default class Game {
  constructor() {
    this.resetGame();
    this.updateUI();
  }

  resetGame() {
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

    // surrounding cells
    this.surroundingCells = new Set([
      "c3", "c4", "c5", "c6",
      "d3", "d6",
      "e3", "e6",
      "f3", "f4", "f5", "f6"
    ]);

    // set turn to black
    this.state = State.BLACK_TURN;
  }

  updateUI() {
    // display pieces
    this.board.forEach((row, i) => {
      row.forEach((cellValue, j) => {
        // check if piece
        if (cellValue != 0) {
          const cell = this.indexToCell(i, j);
          this.placePiece(cell, cellValue);
        }
      });
    });
  }

  placePiece(cell, pieceValue) {
    const cellElement = document.getElementById(cell);

    this.cleanCell(cellElement);

    // piece element
    const piece = document.createElement('div');
    piece.className = (pieceValue == BLACK_PIECE_VALUE) ? 'black-piece' : 'white-piece';

    cellElement.appendChild(piece);

    // update board
    const index = this.cellToIndex(cell);
    this.board[index[0]][index[1]] = pieceValue;

    // update surrounding cells
    this.surroundingCells.delete(cell);
    for (const emptyCell of this.getCellEmptyNeighbors(cell)) {
      this.surroundingCells.add(emptyCell);
    }
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
    cell.textContent = null;
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

    // loop through neighbors
    // optimization → https://stackoverflow.com/a/67758639
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (!(x == 0 && y == 0)) {
          const nX = i + x;
          const nY = j + y;

          if ((nX >= 0 && nX < BOARD_LENGTH) && (nY >= 0 && nY < BOARD_LENGTH)) {
            // check if opposite color piece
            const v = this.board[nX][nY];
            if (v != 0 && v != pieceValue) {
              // check if a sandwich is possible
              if (this.isSandwich(cellIndex, pieceValue, [x, y])) {
                return true
              }
            }
          }
        }
      }
    }

    return false;
  }

  isSandwich(cellIndex, pieceValue, direction) {
    const nextPiecesIndexes = this.getAllPiecesIndexesTowards(cellIndex, direction);

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
    // step forward until its reach border
    while (
      0 < i < BOARD_LENGTH &&
      0 < j < BOARD_LENGTH
    ) {
      // move forwards
      i += dX;
      j += dY;
      // check cell has a piece
      if (this.board[i][j] != 0) {
        cellsIndexes.push([i, j]);
      } else {
        break;
      }
    }

    return cellsIndexes;
  }
}