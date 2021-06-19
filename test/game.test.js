/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
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
  game = new Game();
});

afterEach(() => {
  // restore the original func after test
  jest.resetModules();
});

import Game from "../src/game";

test('constructor', () => {
  expect(game.previousNoMoveCount).toBe(0);

  expect(game.BLACK_PIECE.value).toBe(1);
  expect(game.WHITE_PIECE.value).toBe(2);

  expect(game.BLACK_PIECE.value).toBe(1);
  expect(game.WHITE_PIECE.value).toBe(2);

  expect(game.board).toEqual([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]);

  expect(game.blackPiecesCount).toBe(2);
  expect(game.whitePiecesCount).toBe(2);

  expect(game.surroundingCells).toEqual(
    new Set([
      'c3', 'c4', 'c5', 'c6',
      'd3', 'd6',
      'e3', 'e6',
      'f3', 'f4', 'f5', 'f6'
    ])
  );

  expect(game.state).toBe(game.STATE.BLACK_TURN);

  expect(game.sandwiches).toMatchObject({
    'c4': ['d4'],
    'd3': ['d4'],
    'e6': ['e5'],
    'f5': ['e5'],
  });
});

test('resetGame()', () => {
  game.resetGame();

  expect(game.previousNoMoveCount).toBe(0);

  expect(game.BLACK_PIECE.value).toBe(1);
  expect(game.WHITE_PIECE.value).toBe(2);

  expect(game.BLACK_PIECE.value).toBe(1);
  expect(game.WHITE_PIECE.value).toBe(2);

  expect(game.board).toEqual([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]);

  expect(game.blackPiecesCount).toBe(2);
  expect(game.whitePiecesCount).toBe(2);

  expect(game.surroundingCells).toEqual(
    new Set([
      'c3', 'c4', 'c5', 'c6',
      'd3', 'd6',
      'e3', 'e6',
      'f3', 'f4', 'f5', 'f6'
    ])
  );

  expect(game.state).toBe(game.STATE.BLACK_TURN);

  expect(game.sandwiches).toMatchObject({
    'c4': ['d4'],
    'd3': ['d4'],
    'e6': ['e5'],
    'f5': ['e5'],
  });
});

test('placePiece()', () => {
  // Black legal move
  game.placePiece("c4");

  expect(game.board).toEqual([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]);
  expect(game.previousNoMoveCount).toBe(0);
  expect(game.blackPiecesCount).toBe(4);
  expect(game.whitePiecesCount).toBe(1);
  expect(game.state).toBe(game.STATE.WHITE_TURN); 
  expect(game.surroundingCells).toEqual(
    new Set([
      'b3', 'b4', 'b5',
      'c3', 'c5', 'c6',
      'd3', 'd6',
      'e3', 'e6',
      'f3', 'f4', 'f5', 'f6'
    ])
  );
  expect(game.sandwiches).toMatchObject({
    'c3': ['d4'],
    'c5': ['d5'],
    'e3': ['e4'],
  });

  // White legal move
  game.placePiece("c3");

  expect(game.board).toEqual([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 1, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]);
  expect(game.previousNoMoveCount).toBe(0);
  expect(game.blackPiecesCount).toBe(3);
  expect(game.whitePiecesCount).toBe(3);
  expect(game.state).toBe(game.STATE.BLACK_TURN);
  expect(game.surroundingCells).toEqual(
    new Set([
      'b2', 'b3', 'b4', 'b5',
      'c2', 'c5', 'c6',
      'd2', 'd3', 'd6',
      'e3', 'e6',
      'f3', 'f4', 'f5', 'f6'
    ])
  );
  expect(game.sandwiches).toMatchObject({
    'c2': ['c3'],
    'd3': ['d4'],
    'e6': ['e5'],
    'f5': ['e5']
  });

  // Illegal move
  expect(() => {
    game.placePiece("h7")
  }).toThrowError(new EvalError('h7 cell is not a legal move'));

  // Not possible move
  expect(() => {
    game.placePiece("z12")
  }).toThrowError(new EvalError('z12 cell is not a legal move'));
});

test('endGame()', () => {
  game.endGame();

  expect(game.sandwiches).toEqual([]);
  expect(game.state in [game.STATE.WIN_BLACK, game.STATE.WIN_WHITE]).toBeTruthy();
});

test('checkDraw() (1) no more legal moves', () => {
  game.previousNoMoveCount = 2;
  game.checkDraw();

  expect(game.sandwiches).toEqual([]);
  expect(game.state in [game.STATE.WIN_BLACK, game.STATE.WIN_WHITE]).toBeTruthy();
});

test('checkDraw() (2) skip player turn', () => {
  game.previousNoMoveCount = 0;
  game.sandwiches = [];
  game.checkDraw();

  expect(game.previousNoMoveCount).toBe(0);
  expect(game.state in [game.STATE.BLACK_TURN, game.STATE.WHITE_TURN]).toBeTruthy();
});

test('checkDraw() (3) possible legal moves', () => {
  game.previousNoMoveCount = 1;
  game.sandwiches = { 'c2': ['c3'] };
  game.checkDraw();

  expect(game.previousNoMoveCount).toBe(0);
  expect(game.state in [game.STATE.BLACK_TURN, game.STATE.WHITE_TURN]).toBeTruthy();
});