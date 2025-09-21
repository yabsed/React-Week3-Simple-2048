import { useEffect, useState } from "react";
import { initMap, updateMap, judge } from "../utils/gameLogic";

const getInitBoard = () => {
  const savedState = localStorage.getItem("boardState");
  return savedState ? JSON.parse(savedState) : initMap();
};

const getInitBoardHistory = () => {
  const savedPrevStack = localStorage.getItem("boardHistory");
  if (savedPrevStack) return JSON.parse(savedPrevStack);
  else return [];
};

const getInitScore = () => {
  const savedState = localStorage.getItem("scoreState");
  return savedState ? JSON.parse(savedState) : 0;
};

const getInitScoreHistory = () => {
  const savedScoreHistory = localStorage.getItem("scoreHistory");
  return savedScoreHistory ? JSON.parse(savedScoreHistory) : [0];
};

function Game() {
  const [boardHistory, setBoardHistory] = useState(getInitBoardHistory());
  const [scoreHistory, setScoreHistory] = useState(getInitScoreHistory());
  const [board, setBoard] = useState(getInitBoard());
  const [score, setScore] = useState(getInitScore());

  useEffect(() => {
    localStorage.setItem("boardHistory", JSON.stringify(boardHistory));
    localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));
    localStorage.setItem("boardState", JSON.stringify(board));
    localStorage.setItem("scoreState", JSON.stringify(score));
  }, [boardHistory, scoreHistory, board, score]);

  const update = (dir) => {
    if (dir === "reset") {
      setBoardHistory([]);
      setScoreHistory([]);
      setBoard(initMap());
      setScore(0);
    } else if (dir === "prev") {
      if (boardHistory.length > 0 && scoreHistory.length > 1) {
        const lastBoard = boardHistory[boardHistory.length - 1];
        const lastScore = scoreHistory[scoreHistory.length - 1];
        setBoard(lastBoard);
        setScore(lastScore);
        setBoardHistory(boardHistory.slice(0, -1));
        setScoreHistory(scoreHistory.slice(0, -1));
      }
    } else {
      setBoardHistory((history) => [...history, board]);
      setScoreHistory((history) => [...history, score]);
      const moveResult = updateMap(board, dir);
      setBoard(moveResult.board);
      setScore((score) => score + moveResult.score);
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
  }, [board]);

  return (
    <>
      <h1>Hello 2048!</h1>
      <h2>Current Score : {score}</h2>
      <div>
        <button onClick={() => update("up")}>Up</button>
        <button onClick={() => update("down")}>Down</button>
        <button onClick={() => update("left")}>Left</button>
        <button onClick={() => update("right")}>Right</button>
      </div>
      <Board board={board} />
      <button onClick={() => update("reset")}>Reset</button>
      <button onClick={() => update("prev")}>Prev</button>
      {judge(board) === "continue" ? null : judge(board) === "won" ? (
        <h2>You Won</h2>
      ) : (
        <h2>You Lose!</h2>
      )}
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
