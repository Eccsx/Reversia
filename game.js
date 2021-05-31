const State = {
  'BLACK_TURN' : 0,
  'WHITE_TURN' : 1,
  'WIN' : 2,
  'NO_MOVE' : 3
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
          this.placePiece([i, j], cellValue);
        }
      });
    });
  }

  placePiece(index, cellValue) {
    const cellName = this.indexToName(index);
    const cell = document.getElementById(cellName);

    this.cleanCell(cell);
    
    // piece element
    const piece = document.createElement('div');
    piece.className = (cellValue == BLACK_PIECE_VALUE) ? 'black-piece' : 'white-piece';

    cell.appendChild(piece);
  }

  indexToName(index) {
    return String.fromCharCode(97 + index[1]) + (index[0] + 1);
  }

  cleanCell(cell) {
    cell.textContent = null;
  }
}