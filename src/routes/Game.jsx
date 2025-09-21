import { useEffect, useState } from "react";
import * as logic from "../utils/gameLogic";

function Game() {
  const n = 4;

  const [board, setBoard] = useState(
    Array(4)
      .fill()
      .map(() => Array(n).fill(0))
  );

  useEffect(() => {
    // Update Board
    const boardWithOneBlock = logic.getBoardWithNewBlock(board);
    const boardWithTwoBlocks =
      logic.getBoardWithNewBlock(boardWithOneBlock);
    setBoard(boardWithTwoBlocks);
  }, []);

  const update = (dir) => {
    setBoard((prevBoard) => {
      const movedBoard = logic.move(prevBoard, dir);
      let newBoard = movedBoard;
      if (!logic.isBoardEqual(prevBoard, movedBoard)) {
        newBoard = logic.getBoardWithNewBlock(movedBoard);
      }
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
      <h2>Current Score : {logic.getScore(board)}</h2>
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
