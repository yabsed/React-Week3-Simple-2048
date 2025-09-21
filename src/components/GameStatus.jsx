import React from "react";
import { judge } from "../utils/gameLogic";

function GameStatus({ score, board }) {
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
    </>
  );
}

export default GameStatus;
