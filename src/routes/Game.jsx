import { useEffect, useState } from "react";
import { initMap, updateMap, judge, getScore } from "../utils/gameLogic";

const getInitState = () => {
  const savedState = localStorage.getItem("gameState");
  return savedState ? JSON.parse(savedState) : initMap();
};

const getInitPrevStack = () => {
  const savedPrevStack = localStorage.getItem("gamePrevStack");
  if (savedPrevStack) return JSON.parse(savedPrevStack);
  else return [];
};

function Game() {
  const [prevStack, setPrevStack] = useState(getInitPrevStack());
  const [board, setBoard] = useState(getInitState());

  useEffect(() => {
    localStorage.setItem("gameState", JSON.stringify(board));
  }, [board]);

  useEffect(() => {
    localStorage.setItem("gamePrevStack", JSON.stringify(prevStack));
  }, [prevStack]);

  const update = (dir) => {
    if (dir === "reset") {
      const newBoard = initMap();
      setPrevStack([]);
      setBoard(newBoard);
    } else if (dir === "prev") {
      if (prevStack.length > 0) {
        const last = prevStack[prevStack.length - 1];
        setBoard(last);
        setPrevStack(prevStack.slice(0, -1));
      }
    } else {
      setPrevStack((stack) => [...stack, board]);
      setBoard((board) => updateMap(board, dir));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (judge(board) !== "continue") return;
      if (e.key === "w" || e.key === "ArrowUp") update("up");
      if (e.key === "s" || e.key === "ArrowDown") update("down");
      if (e.key === "a" || e.key === "ArrowLeft") update("left");
      if (e.key === "d" || e.key === "ArrowRight") update("right");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, prevStack]);

  return (
    <>
      <h1>Hello 2048!</h1>
      <h2>Current Score : {getScore(board)}</h2>
      <Board board={board} />
      <button onClick={() => update("reset")}>Reset</button>
      <button onClick={() => update("prev")}>Prev</button>
      {judge(board) === "continue"
        ? null
        : judge(board) === "won"
        ? <h2>You Won</h2>
        : <h2>You Lose!</h2>}
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
  const colors = {
    0: { bg: "#fff", color: "#776e65" },
    2: { bg: "#ff0000", color: "#fff" },
    4: { bg: "#ff7f00", color: "#fff" },
    8: { bg: "#ffff00", color: "#776e65" },
    16: { bg: "#00ff00", color: "#fff" },
    32: { bg: "#0000ff", color: "#fff" },
    64: { bg: "#4b0082", color: "#fff" },
    128: { bg: "#8b00ff", color: "#fff" },
    256: { bg: "#ff69b4", color: "#fff" },
    512: { bg: "#00ced1", color: "#fff" },
    1024: { bg: "#ffd700", color: "#776e65" },
    2048: { bg: "#9400d3", color: "#fff" },
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
