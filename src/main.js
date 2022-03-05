/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import GeneticEvaluationWeigth from './genetic.js';

const genetic = new GeneticEvaluationWeigth(5, 10, 0.3);

console.time('GA runtime');
const player = genetic.runEvolution();
console.timeEnd('GA runtime');

console.log(player);
