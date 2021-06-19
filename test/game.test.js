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

beforeEach(() => {
  document.documentElement.innerHTML = html.toString();
});

afterEach(() => {
  // restore the original func after test
  jest.resetModules();
});

import Game from "../src/game";

test('resetGame()', () => {
  const game = new Game();
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

test('constructor', () => {
  const game = new Game();

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
  const game = new Game();
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