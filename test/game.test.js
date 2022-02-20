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

test('playMove()', () => {
    // Black legal move
    game.playMove("c4");

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
    game.playMove("c3");

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
    game.sandwiches = {
        'c2': ['c3']
    };
    game.checkDraw();

    expect(game.previousNoMoveCount).toBe(0);
    expect(game.state in [game.STATE.BLACK_TURN, game.STATE.WHITE_TURN]).toBeTruthy();
});

test('isVictory() (1) Black wins', () => {
    const match = 'f5d6c4d3e6f4e3f6c5b4e7f3c6d7b5a5c3b3g5h5g4h4e2g6b6d8c7c8a4a6a7f1a3c2d2b2e1b7g3h3f2d1a1a2b1a8c1g1f7g8e8f8b8g7h8h7h6h2g2h1';
    game.loadTranscript(match);

    expect(game.isVictory()).toBeTruthy();
    expect(game.state).toBe(game.STATE.WIN_BLACK);
});

test('isVictory() (2) White wins', () => {
    const match = 'd3c5f6f5e6e3d6f7b6d7e2c6d8c4e7c3f4c8c7d2d1a6b3f3b8f8b5f2e8a8b4b7a7a5g3f1g4g5h6a4g6e1b2c1c2h3h4g2g7h2h1a1g1b1a2a3h7h8g8h5';
    game.loadTranscript(match);

    expect(game.isVictory()).toBeTruthy();
    expect(game.state).toBe(game.STATE.WIN_WHITE);
});

test('isVictory() (3) Draw', () => {
    const match = 'f5f6e6f4e3c5g5g3g4f3e2h6c4d6h5h4e7f2g6f7d3c6d2h3d7b3b4c8d8c3b6e8b5c7f1c2a3b2f8g8a1a2b7e1d1c1h7h8g7a8b1a6g1g2a5a7b8a4h1h2';
    game.loadTranscript(match);

    expect(game.isVictory()).toBeTruthy();
    expect(game.state).toBe(game.STATE.DRAW);
});

test('isVictory() (3) Game not finished', () => {
    const match = 'f5f6e6f4e3c5g5g3';
    game.loadTranscript(match);

    expect(game.isVictory()).toBeFalsy();
    expect(game.state).toBe(game.STATE.BLACK_TURN);
});