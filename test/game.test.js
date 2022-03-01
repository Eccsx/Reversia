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

test('isVictory() (4) Draw', () => {
  const match = 'e6f6f5d6c5g4d7c6f7b5f4e3c7e7b6d8c8b8e8f8f3g3c4c3d3g8e2f2h4g6d2h5h3g5b3e1a4c1b4h2d1a6h7f1a5g2g7c2b2a2a3h8a1h6b1b7a7a8g1h1';
  game.loadTranscript(match);

  expect(game.isVictory()).toBeTruthy();
  expect(game.state).toBe(game.STATE.DRAW);
});

test('isVictory() (4) White count after no more possible moves', () => {
  const match = 'f5d6c3d3c4f4c5b3c2e6c6b4b5d2e3a6f3b6d1f6f7c1b1g6a3f8a5e2f2g5h6h4d7a4e7c8d8e8c7a2h7h5h3b2a7a8g7h8g8b8b7g4g3h2g1f1e1h1g2';
  game.loadTranscript(match);

  expect(game.isVictory()).toBeFalsy();
  expect(game.state).toBe(game.STATE.WIN_WHITE);
});

test('loadTranscript() (1) valid sequence', () => {
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

test('isNoMove() (1) possible legal moves', () => {
  game.loadTranscript('d3e3f3e2f4g3h3h2h1g4g2g1h5h4d6h6h7e6f2c2f1');

  expect(game.isNoMove()).toBeFalsy();
});

test('isNoMove() (2) no legal moves', () => {
  game.loadTranscript('d3c5d6e3b4c3d2c4f4');

  expect(game.isNoMove()).toBeTruthy();
});

test('getAllBlackCell()', () => {
  game.loadTranscript('d3e3f3e2f4g3h3h2h1g4g2g1h5h4d6h6h7e6f2c2f1');

  expect(game.getAllBlackCell()).toMatchObject(
    [
      'f1', 'g1', 'h1',
      'f2', 'g2', 'h2',
      'e3', 'f3', 'g3', 'h3',
      'd4', 'f4', 'h4',
      'd5', 'h5',
      'd6', 'h6',
      'h7',
    ],
  );
});

test('getAllWhiteCell()', () => {
  game.loadTranscript('d3e3f3e2f4g3h3h2h1g4g2g1h5h4d6h6h7e6f2c2f1');

  expect(game.getAllWhiteCell()).toMatchObject(
    [
      'c2', 'e2',
      'd3',
      'e4', 'g4',
      'e5', 'e6',
    ],
  );
});

test('getNumberPieceInCorner() (1) Black', () => {
  game.loadTranscript('e6f4c3c4d3d6f6c6f5g5g6e3f2d2h5e7d7e8e2f3g4g3h4e1c5b3c7b8c1d1f1c2b4b2a1b1g2b6a4f7c8d8a3h2h3h6a7a6a5h1g1a2b5a8f8g8h7h8g7b7');

  expect(game.getNumberPieceInCorner(game.BLACK_PIECE.value)).toBe(1);
});

test('getNumberPieceInCorner() (1) White', () => {
  game.loadTranscript('e6f4c3c4d3d6f6c6f5g5g6e3f2d2h5e7d7e8e2f3g4g3h4e1c5b3c7b8c1d1f1c2b4b2a1b1g2b6a4f7c8d8a3h2h3h6a7a6a5h1g1a2b5a8f8g8h7h8g7b7');

  expect(game.getNumberPieceInCorner(game.WHITE_PIECE.value)).toBe(3);
});
