/**
 * @jest-environment jsdom
 */

import { mockRandom, resetMockRandom } from 'jest-mock-random';
import GeneticEvaluationWeigth from '../src/genetic.evaluation.weigth';

// Global test variables
let genetic;

beforeEach(() => {
  // Instanciate game object
  genetic = new GeneticEvaluationWeigth();
});

afterEach(() => {
  // restore the original func after test
  jest.resetModules();
});

test('randomPlayer()', () => {
  const player = genetic.randomPlayer();
  const [a, b, c, d, e] = player;

  expect(player.length).toBe(5);
  expect(a).toBeGreaterThanOrEqual(0);
  expect(a).toBeLessThanOrEqual(100);
  expect(b).toBeGreaterThanOrEqual(0);
  expect(b).toBeLessThanOrEqual(100);
  expect(c).toBeGreaterThanOrEqual(0);
  expect(c).toBeLessThanOrEqual(100);
  expect(d).toBeGreaterThanOrEqual(0);
  expect(d).toBeLessThanOrEqual(100);
  expect(e).toBeGreaterThanOrEqual(0);
  expect(e).toBeLessThanOrEqual(100);
});

test('runEvolution()', () => {
  mockRandom([
    // Random players
    0.41, 0.95, 0.35, 0.67, 0.62,
    0.34, 0.05, 0.38, 0.11, 0.02,
    0.81, 0.57, 0.87, 0.52, 0.80,
    // Pick parents
    0.75, 0.19,
    // Single point crossover
    0.47,
    // Mutations
    0.42, 0.82, 0.53, 0.59, 0.46, 0.89, 0.23, 0.13,
    0.42, 0.82, 0.53, 0.59, 0.46, 0.89, 0.23, 0.13,
  ]);

  genetic.populationSize = 3;
  genetic.maxGeneration = 2;
  genetic.mutationProbability = 0.3;

  expect(genetic.runEvolution()).toMatchObject([81, 57, 87, 52, 80]);

  resetMockRandom();
});

test('randomPlayer()', () => {
  mockRandom([0.41, 0.95, 0.35, 0.67, 0.62]);

  expect(genetic.randomPlayer()).toMatchObject([41, 95, 35, 67, 62]);

  resetMockRandom();
});

test('fitness()', () => {
  genetic.populationSize = 3;
  const population = [
    [1, 1, 1, 1, 1],
    [82, 39, 43, 1, 20],
    [34, 0, 3, 11, 0],
  ];

  expect(genetic.fitness(population)).toMatchObject([2, 4, 0]);

  resetMockRandom();
});

test('round()', () => {
  const player1 = [Math.random() * 101, Math.random() * 101, Math.random() * 101, Math.random() * 101, Math.random() * 101];
  const player2 = [Math.random() * 101, Math.random() * 101, Math.random() * 101, Math.random() * 101, Math.random() * 101];

  console.log(player1, player2);

  expect(genetic.round(player1, player2)).toMatchObject([1, 1]);

  resetMockRandom();
});

test('pickElites()', () => {
  const population = [
    [1, 1, 1, 1, 1],
    [82, 39, 43, 1, 20],
    [34, 0, 3, 11, 0],
  ];
  const fitnesses = [0, 10, 5];

  expect(genetic.pickElites(population, fitnesses))
    .toMatchObject([[82, 39, 43, 1, 20], [34, 0, 3, 11, 0]]);

  resetMockRandom();
});

test('pickParents()', () => {
  mockRandom([0.75, 0.19]);

  const population = [
    [1, 1, 1, 1, 1],
    [82, 39, 43, 1, 20],
    [34, 0, 3, 11, 0],
  ];
  const fitnesses = [4, 10, 7];

  expect(genetic.pickParents(population, fitnesses))
    .toMatchObject([[34, 0, 3, 11, 0], [1, 1, 1, 1, 1]]);

  resetMockRandom();
});

test('singlePointCrossover()', () => {
  mockRandom(0.4);

  const parent1 = [82, 39, 43, 1, 20];
  const parent2 = [34, 0, 3, 11, 0];

  expect(genetic.singlePointCrossover(parent1, parent2))
    .toMatchObject([[34, 0, 3, 1, 20], [82, 39, 43, 11, 0]]);

  resetMockRandom();
});

test('mutate()', () => { // 5
  mockRandom([0.42, 0.82, 0.53, 0.59, 0.46, 0.89, 0.23, 0.13]);

  genetic.mutationProbability = 0.5;
  const offspring = [82, 39, 43, 1, 20];

  genetic.mutate(offspring);
  expect(offspring).toMatchObject([82, 39, 43, 89, 13]);

  resetMockRandom();
});
