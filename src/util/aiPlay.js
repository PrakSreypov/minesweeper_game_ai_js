// // Global tracking variables for AI win rate
// let aiWins = 0;
// let aiLosses = 0;

// export const aiPlay = (
//     grid,
//     nonMineCount,
//     mineLocations,
//     revealCell,
//     setGameOver,
//     setWinMessage,
//     setLossMessage
// ) => {
//     const unrevealedCells = [];
//     const safeMoves = [];
//     const riskyMoves = [];

//     // Collect all unrevealed cells
//     for (let i = 0; i < grid.length; i++) {
//         for (let j = 0; j < grid[i].length; j++) {
//             if (!grid[i][j].revealed) {
//                 unrevealedCells.push({ x: i, y: j });
//             }
//         }
//     }

//     // If there are no unrevealed cells left, AI has won
//     if (unrevealedCells.length === 0) {
//         setGameOver(true);
//         setWinMessage("Congratulations! AI won!");
//         aiWins++;
//         logWinPercentage();
//         return;
//     }

//     // Analyze the grid for safe moves and risky moves
//     for (let i = 0; i < grid.length; i++) {
//         for (let j = 0; j < grid[i].length; j++) {
//             if (grid[i][j].revealed && grid[i][j].value !== "X") {
//                 const adjacentMines = grid[i][j].value;
//                 const flaggedCount = countFlaggedMines(grid, i, j);
//                 const unrevealedAround = getUnrevealedAround(grid, i, j);

//                 // If the number of flagged mines equals the number indicated
//                 if (flaggedCount === adjacentMines) {
//                     safeMoves.push(...unrevealedAround);
//                 } else if (unrevealedAround.length > 0) {
//                     riskyMoves.push(...unrevealedAround);
//                 }
//             }
//         }
//     }

//     // If there are safe moves, make the safest move
//     if (safeMoves.length > 0) {
//         const move = selectBestSafeMove(safeMoves, grid);
//         revealCell(move.x, move.y);
//         return;
//     }

//     // If no safe moves, analyze risky moves based on probability
//     if (riskyMoves.length > 0) {
//         const move = selectBestRiskyMove(riskyMoves, grid);
//         revealCell(move.x, move.y);
//         return;
//     }

//     // If no moves available, fall back to random choice
//     const randomCell =
//         unrevealedCells[Math.floor(Math.random() * unrevealedCells.length)];
//     revealCell(randomCell.x, randomCell.y);
// };

// // Helper function to count flagged mines around a cell
// const countFlaggedMines = (grid, x, y) => {
//     let count = 0;
//     for (let i = x - 1; i <= x + 1; i++) {
//         for (let j = y - 1; j <= y + 1; j++) {
//             if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
//                 if (grid[i][j].flagged) {
//                     count++;
//                 }
//             }
//         }
//     }
//     return count;
// };

// // Helper function to get unrevealed cells around a revealed cell
// const getUnrevealedAround = (grid, x, y) => {
//     const unrevealed = [];
//     for (let i = x - 1; i <= x + 1; i++) {
//         for (let j = y - 1; j <= y + 1; j++) {
//             if (
//                 i >= 0 &&
//                 i < grid.length &&
//                 j >= 0 &&
//                 j < grid[i].length &&
//                 !grid[i][j].revealed
//             ) {
//                 unrevealed.push({ x: i, y: j });
//             }
//         }
//     }
//     return unrevealed;
// };

// // Function to select the best safe move based on the lowest risk
// const selectBestSafeMove = (safeMoves, grid) => {
//     // Implement logic to determine the best safe move based on your strategy
//     return safeMoves[0]; // Modify this to select a better safe move
// };

// // Function to select the best risky move based on probability
// const selectBestRiskyMove = (riskyMoves, grid) => {
//     let bestMove;
//     let lowestRiskProbability = Infinity;

//     riskyMoves.forEach((move) => {
//         const surroundingMinesCount = countSurroundingMines(grid, move.x, move.y);
//         const riskProbability =
//             surroundingMinesCount /
//             getUnrevealedAround(grid, move.x, move.y).length;

//         if (riskProbability < lowestRiskProbability) {
//             lowestRiskProbability = riskProbability;
//             bestMove = move;
//         }
//     });

//     return bestMove || riskyMoves[Math.floor(Math.random() * riskyMoves.length)];
// };

// // Helper function to count potential surrounding mines for a given cell
// const countSurroundingMines = (grid, x, y) => {
//     let count = 0;

//     for (let i = x - 1; i <= x + 1; i++) {
//         for (let j = y - 1; j <= y + 1; j++) {
//             if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
//                 if (grid[i][j].value === "X") {
//                     // Assuming "X" indicates a mine
//                     count++;
//                 }
//             }
//         }
//     }

//     return count;
// };

// // Track the loss scenario and log win percentage
// export const setLossScenario = () => {
//     aiLosses++;
//     logWinPercentage();
// };

// // Function to log AI win percentage
// const logWinPercentage = () => {
//     const totalGames = aiWins + aiLosses;
//     const winPercentage = ((aiWins / totalGames) * 100).toFixed(2);
//     console.log(
//         `AI Win Percentage: ${winPercentage}% (${aiWins} wins out of ${totalGames} games)`
//     );
// };

// =====================================
// AI player logic for Minesweeper

let aiWins = 0;
let aiLosses = 0;

// Helper function to count potential surrounding mines for a given cell
const countSurroundingMines = (grid, x, y) => {
    let count = 0;

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
                if (grid[i][j].value === "X") {
                    // Assuming "X" indicates a mine
                    count++;
                }
            }
        }
    }

    return count;
};

// Helper function to count flagged mines around a cell
const countFlaggedMines = (grid, x, y) => {
    let count = 0;

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
                if (grid[i][j].flagged) {
                    count++;
                }
            }
        }
    }

    return count;
};

// Helper function to get unrevealed cells around a given cell
const getUnrevealedAround = (grid, x, y) => {
    const unrevealedCells = [];

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
                if (!grid[i][j].revealed) {
                    unrevealedCells.push({ x: i, y: j });
                }
            }
        }
    }

    return unrevealedCells;
};

// Function to select the best risky move based on probability
const selectBestRiskyMove = (riskyMoves, grid) => {
    let bestMove;
    let lowestRiskProbability = Infinity;

    riskyMoves.forEach((move) => {
        const surroundingMinesCount = countSurroundingMines(
            grid,
            move.x,
            move.y
        );
        const riskProbability =
            surroundingMinesCount /
            getUnrevealedAround(grid, move.x, move.y).length;

        if (riskProbability < lowestRiskProbability) {
            lowestRiskProbability = riskProbability;
            bestMove = move;
        }
    });

    return (
        bestMove || riskyMoves[Math.floor(Math.random() * riskyMoves.length)]
    );
};

// Function to select the best safe move (assuming you have defined this)
const selectBestSafeMove = (safeMoves, grid) => {
    // Implement logic for selecting the best safe move
    return safeMoves[Math.floor(Math.random() * safeMoves.length)]; // Example: random safe move
};

// AI play function
export const aiPlay = (
    grid,
    nonMineCount,
    mineLocations,
    revealCell,
    setGameOver,
    setWinMessage,
    setLossMessage
) => {
    const unrevealedCells = [];
    const safeMoves = [];
    const riskyMoves = [];

    // Collect all unrevealed cells
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (!grid[i][j].revealed) {
                unrevealedCells.push({ x: i, y: j });
            }
        }
    }

    // If there are no unrevealed cells left, AI has won
    if (unrevealedCells.length === 0) {
        setGameOver(true);
        setWinMessage("Congratulations! AI won!");
        aiWins++;
        logWinPercentage();
        return;
    }

    // Analyze the grid for safe moves and risky moves
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].revealed && grid[i][j].value !== "X") {
                const adjacentMines = grid[i][j].value;
                const flaggedCount = countFlaggedMines(grid, i, j);
                const unrevealedAround = getUnrevealedAround(grid, i, j);

                // If the number of flagged mines equals the number indicated
                if (flaggedCount === adjacentMines) {
                    safeMoves.push(...unrevealedAround);
                } else if (unrevealedAround.length > 0) {
                    riskyMoves.push(...unrevealedAround);
                }
            }
        }
    }

    // If there are safe moves, make the safest move
    if (safeMoves.length > 0) {
        const move = selectBestSafeMove(safeMoves, grid);
        revealCell(move.x, move.y);
        return;
    }

    // If no safe moves, analyze risky moves based on probability
    if (riskyMoves.length > 0) {
        const move = selectBestRiskyMove(riskyMoves, grid);
        revealCell(move.x, move.y);
        return;
    }

    // If no moves available, fall back to random choice
    const randomCell =
        unrevealedCells[Math.floor(Math.random() * unrevealedCells.length)];
    revealCell(randomCell.x, randomCell.y);
};

// Track the loss scenario and log win percentage
export const setLossScenario = () => {
    aiLosses++;
    logWinPercentage();
};

// Function to log AI win percentage
const logWinPercentage = () => {
    const totalGames = aiWins + aiLosses;
    if (totalGames > 0) {
        const winPercentage = ((aiWins / totalGames) * 100).toFixed(2);
        console.log(
            `AI Win Percentage: ${winPercentage}% (${aiWins} wins out of ${totalGames} games)`
        );
    } else {
        console.log("No games played yet.");
    }
};
