/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import GeneticEvaluationWeigth from './genetic.evaluation.weigth.js';

const genetic = new GeneticEvaluationWeigth(0, 0, 0);
let scores;
let player1;
let player2;

function rand() {
  return Math.floor(Math.random() * 101);
}

do {
  player1 = [rand(), rand(), rand(), rand(), rand()];
  player2 = [rand(), rand(), rand(), rand(), rand()];
  scores = genetic.round(player1, player2);
} while (scores[0] % 1 === 0 && scores[1] % 1 === 0);

console.log(scores);
console.log(player1, player2);
