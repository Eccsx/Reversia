/**
 * @jest-environment jsdom
 */

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

import {
  Game
} from "../src/game.js";
import StaticEvaluation from "../src/static.evaluation.js";

test('coinParity() (1) Maximizing Black', () => {
  game.loadTranscript('c4c3d3c5b6');

  expect(StaticEvaluation.coinParity(game, true)).toBe(100 * 1 / 9);
});

test('coinParity() (2) Maximizing White', () => {
  game.loadTranscript('c4c3d3c5b6');

  expect(StaticEvaluation.coinParity(game, false)).toBe(100 * -1 / 9);
});

test('coinActualMobility() (1) Maximizing Black', () => {
  game.loadTranscript('c4c3d3c5b6');

  expect(StaticEvaluation.coinActualMobility(game, true)).toBe(100 * 3 / 17);
});

test('coinActualMobility() (2) Maximizing White', () => {
  game.loadTranscript('c4c3d3c5b6');

  expect(StaticEvaluation.coinActualMobility(game, false)).toBe(100 * -3 / 17);
});

test('coinActualMobility() (3) Maximizing Black no more move', () => {
  game.loadTranscript('d3e3f3c5c6c3b6b5a4c7b2a6f6f5a7a8b7a5c8b8g6a3c4d8e6d7e2e1d6b4f2c2b3a2a1b1c1d1f7f8d2f1g1e7e8f4g8g7g5');

  expect(StaticEvaluation.coinActualMobility(game, true)).toBe(0);
});

test('coinActualMobility() (3) Maximizing White no more move', () => {
  game.loadTranscript('d3e3f3c5c6c3b6b5a4c7b2a6f6f5a7a8b7a5c8b8g6a3c4d8e6d7e2e1d6b4f2c2b3a2a1b1c1d1f7f8d2f1g1e7e8f4g8g7g5');

  expect(StaticEvaluation.coinActualMobility(game, false)).toBe(0);
});

test('coinPotentialMobility() (1) Maximizing Black', () => {
  game.loadTranscript('c4c3d3c5b6');

  expect(StaticEvaluation.coinPotentialMobility(game, true)).toBe(100 * -4 / 28);
});

test('coinPotentialMobility() (2) Maximizing White', () => {
  game.loadTranscript('c4c3d3c5b6');

  expect(StaticEvaluation.coinPotentialMobility(game, false)).toBe(100 * 4 / 28);
});

test('coinPotentialMobility() (3) Maximizing Black no more move', () => {
  game.loadTranscript('e6f4c3c4d3d6f6c6f5g5g6e3f2d2h5e7d7e8e2f3g4g3h4e1c5b3c7b8c1d1f1c2b4b2a1b1g2b6a4f7c8d8a3h2h3h6a7a6a5h1g1a2b5a8f8g8h7h8g7b7');

  expect(StaticEvaluation.coinPotentialMobility(game, true)).toBe(0);
});

test('coinPotentialMobility() (3) Maximizing White no more move', () => {
  game.loadTranscript('e6f4c3c4d3d6f6c6f5g5g6e3f2d2h5e7d7e8e2f3g4g3h4e1c5b3c7b8c1d1f1c2b4b2a1b1g2b6a4f7c8d8a3h2h3h6a7a6a5h1g1a2b5a8f8g8h7h8g7b7');

  expect(StaticEvaluation.coinPotentialMobility(game, false)).toBe(0);
});

test('cornersCaptured() (1) Maximizing Black no corner on board', () => {
  game.loadTranscript('c4c3d3c5b6');

  expect(StaticEvaluation.cornersCaptured(game, true)).toBe(0);
});

test('cornersCaptured() (2) Maximizing White no corner on board', () => {
  game.loadTranscript('c4c3d3c5b6');

  expect(StaticEvaluation.cornersCaptured(game, false)).toBe(0);
});

test('cornersCaptured() (3) Maximizing Black corner on board', () => {
  game.loadTranscript('f5d6c4d3e6f4e3f3c6b4c3c5d2c2e2e1a4d7b3g6b5f1g4b6f2a3a2a5a6c7e8d8e7f8h7b7a8f7b8c8g8a7b1c1f6a1b2g1g2h1g3h3g5h5h2h4h6d1h8g7');

  expect(StaticEvaluation.cornersCaptured(game, true)).toBe(100 * -2 / 4);
});

test('cornersCaptured() (4) Maximizing White corner on board', () => {
  game.loadTranscript('f5d6c4d3e6f4e3f3c6b4c3c5d2c2e2e1a4d7b3g6b5f1g4b6f2a3a2a5a6c7e8d8e7f8h7b7a8f7b8c8g8a7b1c1f6a1b2g1g2h1g3h3g5h5h2h4h6d1h8g7');

  expect(StaticEvaluation.cornersCaptured(game, false)).toBe(100 * 2 / 4);
});

test('staticWeights() (1) Maximizing Black', () => {
  game.loadTranscript('c4c3d3c5b6');

  expect(StaticEvaluation.staticWeights(game, true)).toBe(-2);
});

test('staticWeights() (2) Maximizing White', () => {
  game.loadTranscript('c4c3d3c5b6');

  expect(StaticEvaluation.staticWeights(game, false)).toBe(2);
});

test('staticEvaluation() (1) Maximizing Black', () => {
  game.loadTranscript('c4c3d3c5b6');

  expect(StaticEvaluation.staticEvaluation(game, true))
    .toBeCloseTo(100 * ((1 / 9) + (3 / 17) + (-4 / 28)) + 0 + -2, 5);
});

test('staticEvaluation() (2) Maximizing White', () => {
  game.loadTranscript('c4c3d3c5b6');

  expect(StaticEvaluation.staticEvaluation(game, false))
    .toBeCloseTo(100 * ((-1 / 9) + (-3 / 17) + (4 / 28)) + 0 + 2, 5);
});