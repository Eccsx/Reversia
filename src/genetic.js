import Game from './game.js';
import StaticEvaluation from './static.evaluation.js';

export default class GeneticEvaluationWeigth {
  constructor(populationSize, maxGeneration, mutationProbability) {
    this.populationSize = populationSize;
    this.maxGeneration = maxGeneration;
    this.mutationProbability = mutationProbability;
  }

  runEvolution() {
    // Initial population
    let population = Array.from(Array(this.populationSize), () => this.randomPlayer());
    let fitnesses = [];

    for (let i = 0; i < this.maxGeneration; i += 1) {
      // Fitness evaluation
      fitnesses = this.fitness(population);

      // Elitism
      // Keep the two best player
      const nextGeneration = this.pickElites(population, fitnesses);

      // New population
      do {
        // Selection
        // Pick two different players for reproduction
        // Higher is their score, the more chance they have to be selected
        const [parent1, parent2] = this.pickParents(population, fitnesses);

        // Offspring
        const [offspring1, offspring2] = this.singlePointCrossover(parent1, parent2);

        // Mutation
        this.mutate(offspring1, this.mutationProbability);
        this.mutate(offspring2, this.mutationProbability);

        // Add to new population
        nextGeneration.push(offspring1);
        nextGeneration.push(offspring2);
      } while (nextGeneration.length < this.populationSize);

      // Next generation
      population = nextGeneration;
    }

    // Return best player
    const bestPlayer = this.pickElites(population, fitnesses)[0];
    return bestPlayer;
  }

  randomPlayer() {
    return [
      Math.floor(Math.random() * 101),
      Math.floor(Math.random() * 101),
      Math.floor(Math.random() * 101),
      Math.floor(Math.random() * 101),
      Math.floor(Math.random() * 101),
    ];
  }

  fitness(population) {
    const scores = Array(this.populationSize).fill(0);

    // Each player compete against every others
    for (let i = 0; i < this.populationSize; i += 1) {
      const player = population[i];
      for (let j = (i + 1); j < this.populationSize; j += 1) {
        const oppponent = population[j];
        const [scorePlayer, scoreOpposant] = this.round(player, oppponent);

        scores[i] += scorePlayer;
        scores[j] += scoreOpposant;
      }
    }

    return scores;
  }

  round(player1, player2) {
    const [score1A, score2A] = this.match(player1, player2);
    const [score2B, score1B] = this.match(player2, player1);

    return [score1A + score1B, score2A + score2B];
  }

  match(player1, player2) {
    const game = new Game();

    while (
      game.state !== game.STATE.WIN_BLACK
      && game.state !== game.STATE.WIN_WHITE
      && game.state !== game.STATE.DRAW
    ) {
      const legalMoves = Object.keys(game.sandwiches);

      const evaluations = legalMoves.map((move) => {
        const gameClone = game.clone();
        gameClone.placePiece(move);

        return StaticEvaluation.weightedEvaluation(
          gameClone,
          gameClone.state === gameClone.STATE.BLACK_TURN,
          gameClone.state === gameClone.STATE.BLACK_TURN ? player1 : player2,
        );
      });

      const bestMoveIndex = evaluations.indexOf(Math.max(...evaluations));
      game.placePiece(legalMoves[bestMoveIndex]);
    }

    // Score based on chess standard
    // Win: +1 Draw: 0.5 Lose: 0
    if (game.state !== game.STATE.WIN_BLACK) {
      return [1, 0];
    }
    if (game.state !== game.STATE.WIN_WHITE) {
      return [0, 1];
    } if (game.state !== game.STATE.DRAW) {
      return [0.5, 0.5];
    }
  }

  pickElites(population, fitnesses) {
    const popul = [...population];
    const fits = [...fitnesses];

    // First best
    const bestIndex = fits.indexOf(Math.max(...fits));
    const best = popul[bestIndex];

    popul.splice(bestIndex, 1);
    fits.splice(bestIndex, 1);

    // Second best
    const best2Index = fits.indexOf(Math.max(...fits));
    const best2 = popul[best2Index];

    return [best, best2];
  }

  pickParents(population, fitnesses) {
    const parent1 = this.choiceWeighted(population, fitnesses);
    const parent2 = this.choiceWeighted(population, fitnesses);

    return [parent1, parent2];
  }

  // https://codereview.stackexchange.com/a/237945
  choiceWeighted(array, weights) {
    const sumOfWeights = weights.reduce((a, b) => a + b, 0);
    let choice = Math.random() * sumOfWeights;

    const retIndex = weights.findIndex((weight) => {
      choice -= weight;
      return (choice < 0);
    });

    return array[retIndex];
  }

  singlePointCrossover(parent1, parent2) {
    // Random point
    const index = Math.floor(Math.random() * parent1.length);

    const offspring1 = [...parent1];
    const offspring2 = [...parent2];

    // Exchange all the genes in range
    for (let i = 0; i <= index; i += 1) {
      [offspring1[i], offspring2[i]] = [offspring2[i], offspring1[i]];
    }

    return [offspring1, offspring2];
  }

  mutate(offspring, probability) {
    const off = offspring;
    for (let i = 0; i < offspring.length; i += 1) {
      if (Math.random() <= probability) {
        off[i] = Math.floor(Math.random() * 101);
      }
    }
  }
}
