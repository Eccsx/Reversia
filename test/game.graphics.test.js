/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { default: GameGraphics } = require('../src/game.graphics');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

// Configuration to perform DOM manipulations
// Ressource-> https://dev.to/snowleo208/things-i-learned-after-writing-tests-for-js-and-html-page-4lja
jest
  .dontMock('fs');

// Global test variables
let game;

beforeEach(() => {
  // Load html document
  document.documentElement.innerHTML = html.toString();

  // Instanciate game object
  game = new GameGraphics();
});

afterEach(() => {
  // Restore the original func after test
  jest.resetModules();
});

test('constructor', () => {
  // Pieces
  expect(game.BLACK_PIECE.element)
    .toMatchObject(document.createElement('div'));
  expect(game.WHITE_PIECE.element)
    .toMatchObject(document.createElement('div'));
  expect(game.BLACK_PIECE.element.classList)
    .toContain('black-piece');
  expect(game.WHITE_PIECE.element.classList)
    .toContain('white-piece');

  expect(document.getElementById('e4').children.length)
    .toBe(1);
  expect(document.getElementById('e4').firstChild)
    .toMatchObject(game.BLACK_PIECE.element);
  expect(document.getElementById('d5').children.length)
    .toBe(1);
  expect(document.getElementById('d5').firstChild)
    .toMatchObject(game.BLACK_PIECE.element);
  expect(document.getElementById('e5').children.length)
    .toBe(1);
  expect(document.getElementById('e5').firstChild)
    .toMatchObject(game.WHITE_PIECE.element);
  expect(document.getElementById('d4').children.length)
    .toBe(1);
  expect(document.getElementById('d4').firstChild)
    .toMatchObject(game.WHITE_PIECE.element);

  // Phantoms
  expect(game.BLACK_PIECE.phantom)
    .toMatchObject(document.createElement('div'));
  expect(game.WHITE_PIECE.phantom)
    .toMatchObject(document.createElement('div'));
  expect(game.BLACK_PIECE.phantom.classList)
    .toContain('phantom-black-piece');
  expect(game.WHITE_PIECE.phantom.classList)
    .toContain('phantom-white-piece');

  // Move indicators
  expect(game.MOVE_INDICATOR)
    .toMatchObject(document.createElement('div'));
  expect(game.MOVE_INDICATOR.classList)
    .toContain('move-indicator');

  // Legal moves
  expect(document.getElementById('c4').classList)
    .toContain('legal');
  expect(document.getElementById('c4').children.length)
    .toBe(2);
  expect(document.getElementById('c4').children[0])
    .toMatchObject(game.MOVE_INDICATOR);
  expect(document.getElementById('c4').children[1])
    .toMatchObject(game.BLACK_PIECE.phantom);
  expect(document.getElementById('d3').classList)
    .toContain('legal');
  expect(document.getElementById('d3').children.length)
    .toBe(2);
  expect(document.getElementById('d3').children[0])
    .toMatchObject(game.MOVE_INDICATOR);
  expect(document.getElementById('d3').children[1])
    .toMatchObject(game.BLACK_PIECE.phantom);
  expect(document.getElementById('e6').classList)
    .toContain('legal');
  expect(document.getElementById('e6').children.length)
    .toBe(2);
  expect(document.getElementById('e6').children[0])
    .toMatchObject(game.MOVE_INDICATOR);
  expect(document.getElementById('e6').children[1])
    .toMatchObject(game.BLACK_PIECE.phantom);
  expect(document.getElementById('f5').classList)
    .toContain('legal');
  expect(document.getElementById('f5').children.length)
    .toBe(2);
  expect(document.getElementById('f5').children[0])
    .toMatchObject(game.MOVE_INDICATOR);
  expect(document.getElementById('f5').children[1])
    .toMatchObject(game.BLACK_PIECE.phantom);
});

test('placePiece() & mouseAction()', () => {
  // Play black
  game.placePiece('d3');

  // Pieces
  expect(document.getElementById('e4').children.length)
    .toBe(1);
  expect(document.getElementById('e4').firstChild)
    .toMatchObject(game.BLACK_PIECE.element);
  expect(document.getElementById('d5').children.length)
    .toBe(1);
  expect(document.getElementById('d5').firstChild)
    .toMatchObject(game.BLACK_PIECE.element);
  expect(document.getElementById('d3').children.length)
    .toBe(1);
  expect(document.getElementById('d3').firstChild)
    .toMatchObject(game.BLACK_PIECE.element);
  expect(document.getElementById('d4').children.length)
    .toBe(1);
  expect(document.getElementById('d4').firstChild)
    .toMatchObject(game.BLACK_PIECE.element);
  expect(document.getElementById('e5').children.length)
    .toBe(1);
  expect(document.getElementById('e5').firstChild)
    .toMatchObject(game.WHITE_PIECE.element);

  // Legal moves
  expect(document.getElementById('c3').classList)
    .toContain('legal');
  expect(document.getElementById('c3').children.length)
    .toBe(2);
  expect(document.getElementById('c3').children[0])
    .toMatchObject(game.MOVE_INDICATOR);
  expect(document.getElementById('c3').children[1])
    .toMatchObject(game.BLACK_PIECE.phantom);
  expect(document.getElementById('e3').classList)
    .toContain('legal');
  expect(document.getElementById('e3').children.length)
    .toBe(2);
  expect(document.getElementById('e3').children[0])
    .toMatchObject(game.MOVE_INDICATOR);
  expect(document.getElementById('e3').children[1])
    .toMatchObject(game.BLACK_PIECE.phantom);
  expect(document.getElementById('c5').classList)
    .toContain('legal');
  expect(document.getElementById('c5').children.length)
    .toBe(2);
  expect(document.getElementById('c5').children[0])
    .toMatchObject(game.MOVE_INDICATOR);
  expect(document.getElementById('c5').children[1])
    .toMatchObject(game.BLACK_PIECE.phantom);

  // Nomore legal move
  expect(document.getElementById('c4').classList)
    .not.toContain('legal');
  expect(document.getElementById('c4').children.length)
    .toBe(0);
  expect(document.getElementById('d3').classList)
    .not.toContain('legal');
  expect(document.getElementById('d3').children.length)
    .toBe(1); // Cell where the piece was placed
  expect(document.getElementById('e6').classList)
    .not.toContain('legal');
  expect(document.getElementById('e6').children.length)
    .toBe(0);
  expect(document.getElementById('f5').classList)
    .not.toContain('legal');
  expect(document.getElementById('f5').children.length)
    .toBe(0);

  // Play white
  game.mouseAction('e3');

  // Pieces
  expect(document.getElementById('d3').children.length)
    .toBe(1);
  expect(document.getElementById('d3').firstChild)
    .toMatchObject(game.BLACK_PIECE.element);
  expect(document.getElementById('d4').children.length)
    .toBe(1);
  expect(document.getElementById('d4').firstChild)
    .toMatchObject(game.BLACK_PIECE.element);
  expect(document.getElementById('d5').children.length)
    .toBe(1);
  expect(document.getElementById('d5').firstChild)
    .toMatchObject(game.BLACK_PIECE.element);
  expect(document.getElementById('e3').children.length)
    .toBe(1);
  expect(document.getElementById('e3').firstChild)
    .toMatchObject(game.WHITE_PIECE.element);
  expect(document.getElementById('e4').children.length)
    .toBe(1);
  expect(document.getElementById('e4').firstChild)
    .toMatchObject(game.WHITE_PIECE.element);
  expect(document.getElementById('e5').children.length)
    .toBe(1);
  expect(document.getElementById('e5').firstChild)
    .toMatchObject(game.WHITE_PIECE.element);

  // Legal moves
  expect(document.getElementById('f2').classList)
    .toContain('legal');
  expect(document.getElementById('f2').children.length)
    .toBe(2);
  expect(document.getElementById('f2').children[0])
    .toMatchObject(game.MOVE_INDICATOR);
  expect(document.getElementById('f2').children[1])
    .toMatchObject(game.BLACK_PIECE.phantom);
  expect(document.getElementById('f3').classList)
    .toContain('legal');
  expect(document.getElementById('f3').children.length)
    .toBe(2);
  expect(document.getElementById('f3').children[0])
    .toMatchObject(game.MOVE_INDICATOR);
  expect(document.getElementById('f3').children[1])
    .toMatchObject(game.BLACK_PIECE.phantom);
  expect(document.getElementById('f4').classList)
    .toContain('legal');
  expect(document.getElementById('f4').children.length)
    .toBe(2);
  expect(document.getElementById('f4').children[0])
    .toMatchObject(game.MOVE_INDICATOR);
  expect(document.getElementById('f4').children[1])
    .toMatchObject(game.BLACK_PIECE.phantom);
  expect(document.getElementById('f5').classList)
    .toContain('legal');
  expect(document.getElementById('f5').children.length)
    .toBe(2);
  expect(document.getElementById('f5').children[0])
    .toMatchObject(game.MOVE_INDICATOR);
  expect(document.getElementById('f5').children[1])
    .toMatchObject(game.BLACK_PIECE.phantom);
  expect(document.getElementById('f6').classList)
    .toContain('legal');
  expect(document.getElementById('f6').children.length)
    .toBe(2);
  expect(document.getElementById('f6').children[0])
    .toMatchObject(game.MOVE_INDICATOR);
  expect(document.getElementById('f6').children[1])
    .toMatchObject(game.BLACK_PIECE.phantom);

  // Nomore legal move
  expect(document.getElementById('c3').classList)
    .not.toContain('legal');
  expect(document.getElementById('c3').children.length)
    .toBe(0);
  expect(document.getElementById('e3').classList)
    .not.toContain('legal');
  expect(document.getElementById('e3').children.length)
    .toBe(1); // Cell where the piece was placed
  expect(document.getElementById('c5').classList)
    .not.toContain('legal');
  expect(document.getElementById('c5').children.length)
    .toBe(0);
});

test('updateBoardElements()', () => {
  const cells = ['a1', 'a2'];

  // New piece elements
  game.board = [
    [1, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  game.updateBoardElements(cells);

  expect(document.getElementById('a1').children.length)
    .toBe(1);
  expect(document.getElementById('a1').firstChild)
    .toMatchObject(game.BLACK_PIECE.element);
  expect(document.getElementById('a2').children.length)
    .toBe(1);
  expect(document.getElementById('a2').firstChild)
    .toMatchObject(game.WHITE_PIECE.element);

  // Remove cell elements
  game.board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  game.updateBoardElements(cells);

  expect(document.getElementById('a1').children.length)
    .toBe(0);
  expect(document.getElementById('a2').children.length)
    .toBe(0);
});

test('endGame()', () => {
  game.placePiece('f5');
  game.placePiece('f6');
  game.endGame();

  expect(document.getElementsByClassName('legal').length).toBe(0);
});

test('loadTranscript() (1) Win by only color left', () => {
  game.loadTranscript('e6f4e3f6g5d6e7f5c5');

  expect(document.getElementsByClassName('legal').length).toBe(0);
});

test('loadTranscript() (1) Win by count after no possible moves left', () => {
  game.loadTranscript('f5d6c3d3c4f4c5b3c2e6c6b4b5d2e3a6f3b6d1f6f7c1b1g6a3f8a5e2f2g5h6h4d7a4e7c8d8e8c7a2h7h5h3b2a7a8g7h8g8b8b7g4g3h2g1f1e1h1g2');

  expect(document.getElementsByClassName('legal').length).toBe(0);
});

test('enableStrategyLayout()', () => {
  GameGraphics.enableStrategyLayout();

  // Corner cells
  expect(document.getElementsByClassName('corner').length)
    .toBe(4);

  expect(document.getElementsByClassName('corner')[0])
    .toMatchObject(document.getElementById('a1'));
  expect(document.getElementsByClassName('corner')[1])
    .toMatchObject(document.getElementById('a8'));
  expect(document.getElementsByClassName('corner')[2])
    .toMatchObject(document.getElementById('h1'));
  expect(document.getElementsByClassName('corner')[3])
    .toMatchObject(document.getElementById('h8'));

  // Extremity cells
  expect(document.getElementsByClassName('extremity').length)
    .toBe(12);

  expect(document.getElementsByClassName('extremity')[0])
    .toMatchObject(document.getElementById('a2'));
  expect(document.getElementsByClassName('extremity')[1])
    .toMatchObject(document.getElementById('a7'));
  expect(document.getElementsByClassName('extremity')[2])
    .toMatchObject(document.getElementById('b1'));
  expect(document.getElementsByClassName('extremity')[3])
    .toMatchObject(document.getElementById('b2'));
  expect(document.getElementsByClassName('extremity')[4])
    .toMatchObject(document.getElementById('b7'));
  expect(document.getElementsByClassName('extremity')[5])
    .toMatchObject(document.getElementById('b8'));
  expect(document.getElementsByClassName('extremity')[6])
    .toMatchObject(document.getElementById('g1'));
  expect(document.getElementsByClassName('extremity')[7])
    .toMatchObject(document.getElementById('g2'));
  expect(document.getElementsByClassName('extremity')[8])
    .toMatchObject(document.getElementById('g7'));
  expect(document.getElementsByClassName('extremity')[9])
    .toMatchObject(document.getElementById('g8'));
  expect(document.getElementsByClassName('extremity')[10])
    .toMatchObject(document.getElementById('h2'));
  expect(document.getElementsByClassName('extremity')[11])
    .toMatchObject(document.getElementById('h7'));

  // Border cells
  expect(document.getElementsByClassName('border').length)
    .toBe(16);

  expect(document.getElementsByClassName('border')[0])
    .toMatchObject(document.getElementById('a3'));
  expect(document.getElementsByClassName('border')[1])
    .toMatchObject(document.getElementById('a4'));
  expect(document.getElementsByClassName('border')[2])
    .toMatchObject(document.getElementById('a5'));
  expect(document.getElementsByClassName('border')[3])
    .toMatchObject(document.getElementById('a6'));
  expect(document.getElementsByClassName('border')[4])
    .toMatchObject(document.getElementById('c1'));
  expect(document.getElementsByClassName('border')[5])
    .toMatchObject(document.getElementById('c8'));
  expect(document.getElementsByClassName('border')[6])
    .toMatchObject(document.getElementById('d1'));
  expect(document.getElementsByClassName('border')[7])
    .toMatchObject(document.getElementById('d8'));
  expect(document.getElementsByClassName('border')[8])
    .toMatchObject(document.getElementById('e1'));
  expect(document.getElementsByClassName('border')[9])
    .toMatchObject(document.getElementById('e8'));
  expect(document.getElementsByClassName('border')[10])
    .toMatchObject(document.getElementById('f1'));
  expect(document.getElementsByClassName('border')[11])
    .toMatchObject(document.getElementById('f8'));
  expect(document.getElementsByClassName('border')[12])
    .toMatchObject(document.getElementById('h3'));
  expect(document.getElementsByClassName('border')[13])
    .toMatchObject(document.getElementById('h4'));
  expect(document.getElementsByClassName('border')[14])
    .toMatchObject(document.getElementById('h5'));
  expect(document.getElementsByClassName('border')[15])
    .toMatchObject(document.getElementById('h6'));
});

test('disableStrategyLayout()', () => {
  GameGraphics.enableStrategyLayout();
  GameGraphics.disableStrategyLayout();

  expect(document.getElementsByClassName('corner').length)
    .toBe(0);
  expect(document.getElementsByClassName('extremity').length)
    .toBe(0);
  expect(document.getElementsByClassName('border').length)
    .toBe(0);
});
