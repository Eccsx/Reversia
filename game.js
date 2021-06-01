const State = {
  'BLACK_TURN': 0,
  'WHITE_TURN': 1,
  'WIN': 2,
  'NO_MOVE': 3
}

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

    // set turn to black
    this.state = State.BLACK_TURN;
  }

  updateUI() {
    // display pieces
    this.board.forEach((row, i) => {
      row.forEach((cellValue, j) => {
        // check if piece
        if (cellValue != 0) {
          const cellCode = this.indexToCellCode(i, j); // Will make debug and readability easier
          this.placePiece(cellCode, cellValue);
        }
      });
    });
  }

  placePiece(cellCode, pieceValue) {
    const cell = document.getElementById(cellCode);

    this.cleanCell(cell);

    // piece element
    const piece = document.createElement('div');
    piece.className = (pieceValue == BLACK_PIECE_VALUE) ? 'black-piece' : 'white-piece';

    cell.appendChild(piece);
    const index = this.cellCodeToIndex(cellCode);
  }

  indexToCellCode(row, column) {
    return String.fromCharCode(97 + column) + (row + 1);
  }

  cellCodeToIndex(cellCode) {
    // retrieved letter code and number
    const letterCode = cellCode.charCodeAt(0);
    const number = cellCode[1];

    return [number - 1, letterCode % 97];
  }

  cleanCell(cell) {
    cell.textContent = null;
  }

  // Legal moves detection

  getCellOppositeNeighbors(cellCode, pieceValue) {
    // retrieved cell grid indexes
    const index = this.cellCodeToIndex(cellCode);
    const i = index[0];
    const j = index[1];

    const neighbors = [];

    // loop through neighbors
    // optimization → https://stackoverflow.com/a/67758639
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (!(x == 0 && y == 0)) {
          const nX = i + x;
          const nY = j + y;
          if ((nX >= 0 && nX < 8) && (nY >= 0 && nY < 8)) {
            // store if opposite color
            const v = this.board[nX][nY];
            if (v != 0 && v != pieceValue) {
              const currentCellCode = this.indexToCellCode(nX, nY);
              neighbors.push(currentCellCode);
            }
          }
        }
      }
    }

    return neighbors;
  }
}