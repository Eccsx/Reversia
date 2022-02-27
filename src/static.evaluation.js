export default class StaticEvaluation {
  static coinParity(game, isMaximizingBlack) {
    const blackCoins = game.blackPiecesCount;
    const whiteCoins = game.whitePiecesCount;

    // Score
    const maxPlayerCoins = isMaximizingBlack ? blackCoins : whiteCoins;
    const minPlayerCoins = isMaximizingBlack ? whiteCoins : blackCoins;

    return 100 * (maxPlayerCoins - minPlayerCoins) / (maxPlayerCoins + minPlayerCoins);
  }

  static coinActualMobility(game, isMaximizingBlack) {
    const gameClone = game.clone();

    // Count black legal moves
    gameClone.updateSandwiches(game.BLACK_PIECE.value);
    const blackMobility = gameClone.sandwiches.length;

    // Count white legal moves
    gameClone.updateSandwiches(game.WHITE_PIECE.value);
    const whiteMobility = gameClone.sandwiches.length;

    // Score
    const maxPlayerMobility = isMaximizingBlack ? blackMobility : whiteMobility;
    const minPlayerMobility = isMaximizingBlack ? whiteMobility : blackMobility;

    if ((maxPlayerMobility + minPlayerMobility) != 0) {
      return 100 * (maxPlayerMobility - minPlayerMobility) / (maxPlayerMobility + minPlayerMobility);
    }
    else {
      return 0;
    }
  }

  static coinPotentialMobility(game, isMaximizingBlack) {
    // Count empty space surrounding black coin
    const blackCells = game.getAllBlackCell();

    let emptyBlack = [];
    blackCells.forEach(cell => {
      emptyBlack = new Set([...emptyBlack, ...game.getCellEmptyNeighbors(cell)])
    });

    const whiteMobility = emptyBlack.size;

    // Count empty space surrounding white coin
    const whiteCells = game.getAllWhiteCell();

    let emptyWhite = [];
    whiteCells.forEach(cell => {
      emptyWhite = new Set([...emptyWhite, ...game.getCellEmptyNeighbors(cell)])
    });

    const blackMobility = emptyWhite.size;

    // Score
    const maxPlayerMobility = isMaximizingBlack ? blackMobility : whiteMobility;
    const minPlayerMobility = isMaximizingBlack ? whiteMobility : blackMobility;

    if ((maxPlayerMobility + minPlayerMobility) != 0) {
      return 100 * (maxPlayerMobility - minPlayerMobility) / (maxPlayerMobility + minPlayerMobility);
    }
    else {
      return 0;
    }
  }

  static cornersCaptured(game, isMaximizingBlack) {
    const blackCornerCount = game.getNumberPieceInCorner(game.BLACK_PIECE.value);
    const whiteCornerCount = game.getNumberPieceInCorner(game.WHITE_PIECE.value);

    // Score
    const maxPlayerCornerValue = isMaximizingBlack ? blackCornerCount : whiteCornerCount;
    const minPlayerCornerValue = isMaximizingBlack ? whiteCornerCount : blackCornerCount;

    if ((maxPlayerCornerValue + minPlayerCornerValue) != 0) {
      return 100 * (maxPlayerCornerValue - minPlayerCornerValue) / (maxPlayerCornerValue + minPlayerCornerValue);
    }
    else {
      return 0;
    }
  }

  static staticWeights(game, isMaximizingBlack) {
    // Weights
    const weights = [
      [4, -3, 2, 2, 2, 2, -3, 4],
      [-3, -4, -1, -1, -1, -1, -4, -3],
      [2, -1, 1, 0, 0, 1, -1, 2],
      [2, -1, 0, 1, 1, 0, -1, 2],
      [2, -1, 0, 1, 1, 0, -1, 2],
      [2, -1, 1, 0, 0, 1, -1, 2],
      [-3, -4, -1, -1, -1, -1, -4, -3],
      [4, -3, 2, 2, 2, 2, -3, 4]
    ];

    // Black weights
    const blackCells = game.getAllBlackCell();
    let blackValue = 0;

    blackCells.forEach(cell => {
      const [row, col] = game.cellToIndex(cell);
      blackValue += weights[row][col];
    });

    // White weights
    const whiteCells = game.getAllWhiteCell();
    let whiteValue = 0;

    whiteCells.forEach(cell => {
      const [row, col] = game.cellToIndex(cell);
      whiteValue += weights[row][col];
    });

    // Score
    const maxPlayerUtility = isMaximizingBlack ? blackValue : whiteValue;
    const minPlayerUtility = isMaximizingBlack ? whiteValue : blackValue;

    return maxPlayerUtility - minPlayerUtility;
  }
}