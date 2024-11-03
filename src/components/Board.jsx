// import { useState, useEffect } from "react";
// import createBoard from "../util/createBoard";
// import Cell from "./Cell";
// import { revealed } from "../util/reveal";
// import Modal from "./Modal";
// import Timer from "./Timer";

// const Board = () => {
//     const [grid, setGrid] = useState([]);
//     const [nonMineCount, setNonMineCount] = useState(0);
//     const [mineLocations, setMineLocations] = useState([]);
//     const [gameOver, setGameOver] = useState(false);

//     // ComponentDidMount
//     useEffect(() => {
//         // Creating a board

//         // Calling the function
//         freshBoard();
//     }, []);

//     const freshBoard = () => {
//         const newBoard = createBoard(10, 15, 15);
//         setNonMineCount(10 * 15 - 15);
//         setMineLocations(newBoard.mineLocation);
//         setGrid(newBoard.board);
//     };

//     const restartGame = () => {
//         freshBoard();
//         setGameOver(false);
//     };

//     // On Right Click / Flag Cell
//     const updateFlag = (e, x, y) => {
//         // to not have a dropdown on right click
//         e.preventDefault();
//         // Deep copy of a state
//         let newGrid = JSON.parse(JSON.stringify(grid));
//         console.log(newGrid[x][y]);
//         newGrid[x][y].flagged = true;
//         setGrid(newGrid);
//     };

//     // Reveal Cell
//     const revealCell = (x, y) => {
//         if (grid[x][y].revealed || gameOver) {
//             return;
//         }
//         let newGrid = JSON.parse(JSON.stringify(grid));
//         if (newGrid[x][y].value === "X") {
//             for (let i = 0; i < mineLocations.length; i++) {
//                 newGrid[mineLocations[i][0]][
//                     mineLocations[i][1]
//                 ].revealed = true;
//             }
//             setGrid(newGrid);
//             setGameOver(true);
//         } else {
//             let newRevealedBoard = revealed(newGrid, x, y, nonMineCount);
//             setGrid(newRevealedBoard.arr);
//             setNonMineCount(newRevealedBoard.newNonMinesCount);
//             if (newRevealedBoard.newNonMinesCount === 0) {
//                 setGameOver(true);
//             }
//         }
//     };

//     return (
//         <div>
//             <p>Minesweeper</p>
//             <Timer />
//             <div
//                 style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     position: "relative",
//                 }}
//             >
//                 {gameOver && <Modal restartGame={restartGame} />}
//                 {grid.map((singleRow, index1) => {
//                     return (
//                         <div style={{ display: "flex" }} key={index1}>
//                             {singleRow.map((singleBlock, index2) => {
//                                 return (
//                                     <Cell
//                                         revealCell={revealCell}
//                                         details={singleBlock}
//                                         updateFlag={updateFlag}
//                                         key={index2}
//                                     />
//                                 );
//                             })}
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export default Board;

import { useState, useEffect } from "react";
import createBoard from "../util/createBoard";
import Cell from "./Cell";
import { revealed } from "../util/reveal";
import Modal from "./Modal";
import Timer from "./Timer";
import { aiPlay, setLossScenario } from "../util/aiPlay";

const Board = () => {
    const [grid, setGrid] = useState([]);
    const [nonMineCount, setNonMineCount] = useState(0);
    const [mineLocations, setMineLocations] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [isAutoplay, setIsAutoplay] = useState(false);
    const [flagCount, setFlagCount] = useState(0);
    const [timer, setTimer] = useState(0);
    const [gameLevel, setGameLevel] = useState("easy");
    const [playerMode, setPlayerMode] = useState("human");
    const [winMessage, setWinMessage] = useState("");
    const [lossMessage, setLossMessage] = useState("");
    const [isGameStarted, setIsGameStarted] = useState(false);

    const gameConfig = {
        easy: { rows: 10, cols: 15, mines: 10, timeLimit: 300 },
        intermediate: { rows: 15, cols: 20, mines: 40, timeLimit: 600 },
        hard: { rows: 20, cols: 25, mines: 99, timeLimit: 900 },
    };

    useEffect(() => {
        freshBoard();
    }, [gameLevel]);

    const freshBoard = () => {
        const { rows, cols, mines } = gameConfig[gameLevel];
        const newBoard = createBoard(rows, cols, mines);
        setNonMineCount(rows * cols - mines);
        setMineLocations(newBoard.mineLocation);
        setGrid(newBoard.board);
        setGameOver(false);
        setFlagCount(0);
        setWinMessage("");
        setLossMessage("");
        setTimer(0);
        setIsAutoplay(false);
        setIsGameStarted(false);
    };

    const restartGame = () => {
        freshBoard();
        setGameOver(false);
        setWinMessage("");
        setLossMessage("");
    };

    const updateFlag = (e, x, y) => {
        e.preventDefault();
        if (flagCount < gameConfig[gameLevel].mines) {
            let newGrid = JSON.parse(JSON.stringify(grid));
            newGrid[x][y].flagged = !newGrid[x][y].flagged; // Toggle flag
            setGrid(newGrid);
            setFlagCount((prev) =>
                newGrid[x][y].flagged ? prev + 1 : prev - 1
            );
        }
    };

    const revealCell = (x, y) => {
        if (grid[x][y].revealed || gameOver) {
            return;
        }
        let newGrid = JSON.parse(JSON.stringify(grid));
        if (newGrid[x][y].value === "X") {
            for (let i = 0; i < mineLocations.length; i++) {
                newGrid[mineLocations[i][0]][
                    mineLocations[i][1]
                ].revealed = true;
            }
            setGrid(newGrid);
            setGameOver(true);
            setLossMessage("Game Over! You hit a mine!");
            setLossScenario(); // Track the loss scenario
        } else {
            let newRevealedBoard = revealed(newGrid, x, y, nonMineCount);
            setGrid(newRevealedBoard.arr);
            setNonMineCount(newRevealedBoard.newNonMinesCount);
            if (newRevealedBoard.newNonMinesCount === 0) {
                setGameOver(true);
                setWinMessage("Congratulations! You won!");
            }
        }
    };

    useEffect(() => {
        if (isAutoplay && !gameOver) {
            const interval = setInterval(() => {
                aiPlay(
                    grid,
                    nonMineCount,
                    mineLocations,
                    revealCell,
                    setGameOver,
                    setWinMessage,
                    setLossMessage
                );
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isAutoplay, gameOver, grid, nonMineCount, mineLocations]);

    const startGame = () => {
        setIsGameStarted(true);
        if (playerMode === "ai") {
            startAutoplay();
        }
    };

    const startAutoplay = () => {
        setIsAutoplay(true);
    };

    const stopAutoplay = () => {
        setIsAutoplay(false);
    };

    useEffect(() => {
        if (isAutoplay && !gameOver) {
            const interval = setInterval(() => {
                aiPlay(
                    grid,
                    nonMineCount,
                    mineLocations,
                    revealCell,
                    setGameOver,
                    setWinMessage,
                    setLossMessage
                );
            }, 1000); // AI plays every second
            return () => clearInterval(interval);
        }
    }, [isAutoplay, gameOver, grid, nonMineCount, mineLocations]);

    // Timer logic
    useEffect(() => {
        if (isGameStarted && !gameOver) {
            const timerInterval = setInterval(() => {
                setTimer((prev) => prev + 1);
                if (timer >= gameConfig[gameLevel].timeLimit) {
                    setGameOver(true);
                    setLossMessage("Time's up! You lost!");
                }
            }, 1000);

            return () => clearInterval(timerInterval);
        }
    }, [timer, gameOver, isGameStarted, gameLevel]);

    return (
        <div>
            <h1>Minesweeper</h1>
            <Timer time={timer} />
            <div>
                <label>
                    Select Level:
                    <select
                        onChange={(e) => setGameLevel(e.target.value)}
                        value={gameLevel}
                    >
                        <option value="easy">Easy</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="hard">Hard</option>
                    </select>
                </label>
                <label>
                    Select Player Mode:
                    <select
                        onChange={(e) => setPlayerMode(e.target.value)}
                        value={playerMode}
                    >
                        <option value="human">Human</option>
                        <option value="ai">AI</option>
                    </select>
                </label>
                <button onClick={startGame}>Start Game</button>
                <button onClick={restartGame}>Reset Game</button>
            </div>
            <p>{winMessage}</p>
            <p>{lossMessage}</p>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                {gameOver && <Modal restartGame={restartGame} />}
                {grid.map((singleRow, index1) => {
                    return (
                        <div style={{ display: "flex" }} key={index1}>
                            {singleRow.map((singleBlock, index2) => {
                                return (
                                    <Cell
                                        revealCell={revealCell}
                                        details={singleBlock}
                                        updateFlag={updateFlag}
                                        key={index2}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Board;
