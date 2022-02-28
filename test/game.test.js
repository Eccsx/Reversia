/**
 * @jest-environment jsdom
 */

import Game from '../src/game';

// Global test variables
let game;

beforeEach(() => {
  // Instanciate game object
  game = new Game();
});

afterEach(() => {
  // restore the original func after test
  jest.resetModules();
});

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
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  expect(game.blackPiecesCount).toBe(2);
  expect(game.whitePiecesCount).toBe(2);

  expect(game.surroundingCells).toEqual(
    new Set([
      'c3', 'c4', 'c5', 'c6',
      'd3', 'd6',
      'e3', 'e6',
      'f3', 'f4', 'f5', 'f6',
    ]),
  );

  expect(game.state).toBe(game.STATE.BLACK_TURN);

  expect(game.sandwiches).toMatchObject({
    c4: ['d4'],
    d3: ['d4'],
    e6: ['e5'],
    f5: ['e5'],
  });
});

test('placePiece()', () => {
  // Black legal move
  game.placePiece('c4');

  expect(game.board).toEqual([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
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
      'f3', 'f4', 'f5', 'f6',
    ]),
  );
  expect(game.sandwiches).toMatchObject({
    c3: ['d4'],
    c5: ['d5'],
    e3: ['e4'],
  });

  // White legal move
  game.placePiece('c3');

  expect(game.board).toEqual([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 1, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
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
      'f3', 'f4', 'f5', 'f6',
    ]),
  );
  expect(game.sandwiches).toMatchObject({
    c2: ['c3'],
    d3: ['d4'],
    e6: ['e5'],
    f5: ['e5'],
  });
});

test('isNoMoreMove() (1) possible legal moves', () => {
  game.state = game.STATE.BLACK_TURN;
  game.previousNoMoveCount = 0;
  game.sandwiches = {
    c2: ['c3'],
  };

  expect(game.isNoMoreMove()).toBeFalsy();
  expect(game.previousNoMoveCount).toBe(0);
  expect(game.state).toBe(game.STATE.BLACK_TURN);
});

test('isNoMoreMove() (2) skip turn', () => {
  game.state = game.STATE.BLACK_TURN;
  game.previousNoMoveCount = 0;
  game.sandwiches = {};

  expect(game.isNoMoreMove()).toBeFalsy();
  expect(game.previousNoMoveCount).toBe(1);
  expect(game.state).toBe(game.STATE.WHITE_TURN);
});

test('isNoMoreMove() (3) win', () => {
  game.blackPiecesCount = 12;
  game.whitePiecesCount = 8;
  game.state = game.STATE.BLACK_TURN;
  game.previousNoMoveCount = 1;
  game.sandwiches = {};

  expect(game.isNoMoreMove()).toBeTruthy();
  expect(game.previousNoMoveCount).toBe(2);
  expect(game.state).toBeTruthy(game.STATE.BLACK_WIN);
});

test('isNoMoreMove() (4) draw', () => {
  game.blackPiecesCount = 6;
  game.whitePiecesCount = 6;
  game.state = game.STATE.BLACK_TURN;
  game.previousNoMoveCount = 1;
  game.sandwiches = {};

  expect(game.isNoMoreMove()).toBeTruthy();
  expect(game.previousNoMoveCount).toBe(2);
  expect(game.state).toBe(game.STATE.DRAW);
});

test('isVictory() (1) Black wins', () => {
  const match = 'd3c5d6e3b4c3d2c4f4';
  game.loadTranscript(match);

  expect(game.isVictory()).toBeTruthy();
  expect(game.state).toBe(game.STATE.WIN_BLACK);
});

test('isVictory() (2) White wins', () => {
  const match = 'd3e3f3c5c6c3b6b5a4c7b2a6f6f5a7a8b7a5c8b8g6a3c4d8e6d7e2e1d6b4f2c2b3a2a1b1c1d1f7f8d2f1g1e7e8f4g8g7g5';
  game.loadTranscript(match);

  expect(game.isVictory()).toBeTruthy();
  expect(game.state).toBe(game.STATE.WIN_WHITE);
});

test('isVictory() (3) Black win by pieces count', () => {
  const match = 'e6f4c3c4d3d6f6c6f5g5g6e3f2d2h5e7d7e8e2f3g4g3h4e1c5b3c7b8c1d1f1c2b4b2a1b1g2b6a4f7c8d8a3h2h3h6a7a6a5h1g1a2b5a8f8g8h7h8g7b7';
  game.loadTranscript(match);

  expect(game.isVictory()).toBeTruthy();
  expect(game.state).toBe(game.STATE.WIN_BLACK);
});

test('isVictory() (4) White win by pieces count', () => {
  const match = 'f5d6c4d3e6f4e3f3c6b4c3c5d2c2e2e1a4d7b3g6b5f1g4b6f2a3a2a5a6c7e8d8e7f8h7b7a8f7b8c8g8a7b1c1f6a1b2g1g2h1g3h3g5h5h2h4h6d1h8g7';
  game.loadTranscript(match);

  expect(game.isVictory()).toBeTruthy();
  expect(game.state).toBe(game.STATE.WIN_WHITE);
});

test('isVictory() (5) Draw', () => {
  const match = 'f5f6e6f4e3c5g5g3g4f3e2h6c4d6h5h4e7f2g6f7d3c6d2h3d7b3b4c8d8c3b6e8b5c7f1c2a3b2f8g8a1a2b7e1d1c1h7h8g7a8b1a6g1g2a5a7b8a4h1h2';
  game.loadTranscript(match);

  expect(game.board).toEqual([
    [1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 1, 2, 2, 2, 2, 2],
    [2, 1, 1, 1, 2, 1, 2, 2],
    [2, 2, 2, 2, 1, 1, 2, 2],
    [2, 2, 2, 1, 1, 1, 1, 2],
    [2, 1, 1, 1, 2, 1, 1, 2],
    [2, 1, 1, 1, 1, 1, 1, 2],
    [2, 1, 2, 2, 2, 2, 2, 2],
  ]);
  expect(game.isVictory()).toBeTruthy();
  expect(game.state).toBe(game.STATE.DRAW);
});

test('isVictory() (6) Game not finished', () => {
  const match = 'f5f6e6f4e3c5g5g3';
  game.loadTranscript(match);

  expect(game.board).toEqual([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 2, 0],
    [0, 0, 0, 2, 1, 2, 0, 0],
    [0, 0, 2, 2, 2, 2, 1, 0],
    [0, 0, 0, 0, 1, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  expect(game.isVictory()).toBeFalsy();
  expect(game.state).toBe(game.STATE.BLACK_TURN);
});

test('loadTranscript()', () => {
  const match = 'f5f6e6f4e3c5g5g3';
  game.loadTranscript(match);

  expect(game.board).toEqual([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 2, 0],
    [0, 0, 0, 2, 1, 2, 0, 0],
    [0, 0, 2, 2, 2, 2, 1, 0],
    [0, 0, 0, 0, 1, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  expect(game.state).toBe(game.STATE.BLACK_TURN);
});
