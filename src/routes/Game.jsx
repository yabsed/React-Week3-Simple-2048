import { useEffect, useState } from "react";

function Game() {
  const n = 4;

  const [board, setBoard] = useState(
    Array(4)
      .fill()
      .map(() => Array(n).fill(0))
  );

  const updateBoard = {
    rotate: (board, times = 1) => {
      let rotated = board;
      for (let t = 0; t < times; t++) {
        rotated = rotated[0].map((_, i) =>
          rotated.map((row) => row[i]).reverse()
        );
      }
      return rotated;
    },
    moveAndMergeLeft: (board) => {
      return board.map((row) => {
        const filtered = row.filter((cell) => cell !== 0);
        for (let i = 0; i < filtered.length - 1; i++) {
          if (filtered[i] === filtered[i + 1]) {
            filtered[i] *= 2;
            filtered[i + 1] = 0;
          }
        }
        const merged = filtered.filter((cell) => cell !== 0);
        while (merged.length < n) merged.push(0);
        return merged;
      });
    },
    move: (board, dir) => {
      let workingBoard = board.map((row) => row.slice());

      // Rotate board to simplify movement logic
      if (dir === "up") workingBoard = updateBoard.rotate(workingBoard, 3);
      if (dir === "right") workingBoard = updateBoard.rotate(workingBoard, 2);
      if (dir === "down") workingBoard = updateBoard.rotate(workingBoard, 1);

      // Move and merge left
      workingBoard = updateBoard.moveAndMergeLeft(workingBoard);

      // Rotate back to original orientation
      if (dir === "up") workingBoard = updateBoard.rotate(workingBoard, 1);
      if (dir === "right") workingBoard = updateBoard.rotate(workingBoard, 2);
      if (dir === "down") workingBoard = updateBoard.rotate(workingBoard, 3);

      return workingBoard;
    },
  };

  const boardUtils = {
    getScore: () => {
      return board.flat().reduce((sum, cell) => sum + cell, 0);
    },

    // Get List of Empty Cells Tuple [x, y]
    getEmptyCells: (board) => {
      const emptyCells = [];

      board.forEach((row, i) =>
        row.forEach((cell, j) => {
          if (cell === 0) emptyCells.push([i, j]);
        })
      );
      return emptyCells;
    },

    // The Board is Full of Non-Zero Blocks
    isFull: (board) => {
      return boardUtils.getEmptyCells(board).length === 0;
    },

    // Add one block onto currentBoard and return it as newBoard
    getBoardWithNewBlock: (board) => {
      if (boardUtils.isFull(board)) {
        return board; // 빈 칸이 없으면 그대로 반환
      }

      const emptyCells = boardUtils.getEmptyCells(board);

      // fix point
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];

      // fix value
      const newValue = Math.random() < 0.9 ? 2 : 4;

      // copy and modify
      const newBoard = board.map((arr) => arr.slice());
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

  const update = (dir) => {
    setBoard((prevBoard) => {
      const movedBoard = updateBoard.move(prevBoard, dir);
      const newBoard = boardUtils.getBoardWithNewBlock(movedBoard);
      return newBoard;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "w" || e.key === "ArrowUp") update("up");
      if (e.key === "s" || e.key === "ArrowDown") update("down");
      if (e.key === "a" || e.key === "ArrowLeft") update("left");
      if (e.key === "d" || e.key === "ArrowRight") update("right");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <h1>Hello 2048!</h1>
      <h2>Current Score : {boardUtils.getScore()}</h2>
      <Board board={board} />
    </>
  );
}

// Board 컴포넌트 분리
function Board({ board }) {
  return (
    <div>
      {board.map((row, i) => (
        <div key={i} style={{ display: "flex" }}>
          {row.map((cell, j) => (
            <Cell key={j} value={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}

// Cell 컴포넌트 분리
function Cell({ value }) {
  // 숫자별 배경색 매핑
  const colors = {
    0: { bg: "#fff", color: "#776e65" },
    2: { bg: "#ff0000", color: "#fff" }, // 빨강
    4: { bg: "#ff7f00", color: "#fff" }, // 주황
    8: { bg: "#ffff00", color: "#776e65" }, // 노랑
    16: { bg: "#00ff00", color: "#fff" }, // 초록
    32: { bg: "#0000ff", color: "#fff" }, // 파랑
    64: { bg: "#4b0082", color: "#fff" }, // 남색
    128: { bg: "#8b00ff", color: "#fff" }, // 보라
    256: { bg: "#ff69b4", color: "#fff" }, // 핑크
    512: { bg: "#00ced1", color: "#fff" }, // 청록
    1024: { bg: "#ffd700", color: "#776e65" }, // 금색
    2048: { bg: "#9400d3", color: "#fff" }, // 진보라
  };
  const cellStyle = {
    width: 40,
    height: 40,
    border: "1px solid #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    background: colors[value]?.bg || "#3c3a32",
    color: colors[value]?.color || "#776e65",
    fontWeight: "bold",
    fontSize:
      value === 0
        ? "16px"
        : value < 8
        ? "20px"
        : value < 128
        ? "18px"
        : value < 1024
        ? "16px"
        : "14px",
  };

  return <div style={cellStyle}>{value !== 0 ? value : ""}</div>;
}

export default Game;
