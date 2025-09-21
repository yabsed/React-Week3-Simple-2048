import { useEffect, useState } from "react";
import { initMap, updateMap, judge } from "../utils/gameLogic";
import Board from "../components/Board";

function getLocalStorage(key, defaultValue) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
}

function Game() {
  const [boardHist, setBoardHist] = useState(getLocalStorage("boardHist", []));
  const [scoreHist, setScoreHist] = useState(getLocalStorage("scoreHist", [0]));
  const [board, setBoard] = useState(getLocalStorage("boardState", initMap()));
  const [score, setScore] = useState(getLocalStorage("scoreState", 0));

  useEffect(() => {
    localStorage.setItem("boardHist", JSON.stringify(boardHist));
    localStorage.setItem("scoreHist", JSON.stringify(scoreHist));
    localStorage.setItem("boardState", JSON.stringify(board));
    localStorage.setItem("scoreState", JSON.stringify(score));
  }, [boardHist, scoreHist, board, score]);

  const update = (dir) => {
    switch (dir) {
      case "reset":
        setBoard(initMap());
        setScore(0);
        setBoardHist([]);
        setScoreHist([0]);
        break;
      case "prev":
        if (boardHist.length > 0 && scoreHist.length > 1) {
          setBoard(boardHist[boardHist.length - 1]);
          setScore(scoreHist[scoreHist.length - 2]);
          setBoardHist(boardHist.slice(0, -1));
          setScoreHist(scoreHist.slice(0, -1));
        }
        break;
      default: {
        setBoardHist((history) => [...history, board]);
        setScoreHist((history) => [...history, score]);
        const { board: newBoard, score: addedScore } = updateMap(board, dir);
        setBoard(newBoard);
        setScore((prevScore) => prevScore + addedScore);
        break;
      }
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

export default Game;
