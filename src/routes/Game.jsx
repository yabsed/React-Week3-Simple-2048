import React from "react";
import { useGameState } from "../hooks/useGameState";
import { useGameControls } from "../hooks/useGameControls";
import Board from "../components/Board";
import GameControls from "../components/GameControls";
import GameStatus from "../components/GameStatus";

function Game() {
  // 게임 상태 관리
  const { board, score, boardHist, scoreHist, updateGameState } =
    useGameState();

  // 게임 컨트롤 관리
  const { handleDirectionClick, handleReset, handlePrev } = useGameControls(
    board,
    updateGameState,
    boardHist,
    scoreHist
  );

  return (
    <>
      <GameStatus score={score} board={board} />
      <GameControls
        onDirectionClick={handleDirectionClick}
        onReset={handleReset}
        onPrev={handlePrev}
      />
      <Board board={board} />
    </>
  );
}

export default Game;
