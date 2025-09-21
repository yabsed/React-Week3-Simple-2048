import { useEffect, useState } from "react";

function Game() {
  const n = 4;

  const [board, setBoard] = useState(
    Array(4)
      .fill()
      .map(() => Array(n).fill(0))
  );

  const boardUtils = {
    // Get List of Empty Cells Tuple [x, y]
    getEmptyCells: () => {
      const emptyCells = [];

      board.forEach((row, i) =>
        row.forEach((cell, j) => {
          if (cell === 0) emptyCells.push([i, j]);
        })
      );
      return emptyCells;
    },

    // The Board is Full of Non-Zero Blocks
    isFull: () => {
      return boardUtils.getEmptyCells().length === 0;
    },

    // Add one block onto currentBoard and return it as newBoard
    getBoardWithNewBlock: (currentBoard) => {
      if (boardUtils.isFull()) {
        return currentBoard; // 빈 칸이 없으면 그대로 반환
      }

      const emptyCells = boardUtils.getEmptyCells();

      // fix point
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];

      // fix value
      const newValue = Math.random() < 0.9 ? 2 : 4;

      // copy and modify
      const newBoard = currentBoard.map((arr) => arr.slice());
      newBoard[row][col] = newValue;

      return newBoard;
    },
  };

  useEffect(() => {
    // Update Board
    const boardWithOneBlock = boardUtils.getBoardWithNewBlock(board);
    const boardWithTwoBlocks =
      boardUtils.getBoardWithNewBlock(boardWithOneBlock);
    setBoard(boardWithTwoBlocks);
  }, []);

  console.log(board);

  return (
    <>
      <h1>Hello 2048!</h1>
      <div>
        {board.map((row, i) => (
          <div key={i} style={{ display: "flex" }}>
            {row.map((cell, j) => (
              <div
                key={j}
                style={{
                  width: 40,
                  height: 40,
                  border: "1px solid #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 2,
                  background: cell ? "#eee" : "#fff",
                  fontWeight: "bold",
                }}
              >
                {cell !== 0 ? cell : "_"}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default Game;
