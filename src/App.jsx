import React from "react";
import { useGame } from "./hooks/useGame";
import Board from "./components/Board";
import { judge } from "./utils/gameLogic";

function App() {
  // 게임 상태 및 컨트롤 관리
  const { board, score, boardHist, scoreHist, handleReset, handlePrev } =
    useGame();

  // 게임 결과
  const gameResult = judge(board);

  return (
    <>
      <h1>Hello 2048!</h1>
      <h2>Current Score : {score}</h2>
      {gameResult === "continue" ? null : gameResult === "won" ? (
        <h2>You Won</h2>
      ) : (
        <h2>You Lose!</h2>
      )}
      <div>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handlePrev}>Prev</button>
      </div>
      <Board board={board} />
    </>
  );
}

export default App;
