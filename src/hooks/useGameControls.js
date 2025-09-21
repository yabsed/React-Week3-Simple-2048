import { useEffect } from "react";
import { judge } from "../utils/gameLogic";

export function useGameControls(board, updateGameState, boardHist, scoreHist) {
  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (judge(board) !== "continue") return;

      if (e.key === "w" || e.key === "ArrowUp") updateGameState("up");
      if (e.key === "s" || e.key === "ArrowDown") updateGameState("down");
      if (e.key === "a" || e.key === "ArrowLeft") updateGameState("left");
      if (e.key === "d" || e.key === "ArrowRight") updateGameState("right");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, updateGameState]);

  // 버튼 클릭 핸들러들
  const handleDirectionClick = (direction) => {
    if (judge(board) === "continue") {
      updateGameState(direction);
    }
  };

  const handleReset = () => {
    updateGameState("reset");
  };

  const handlePrev = () => {
    if (boardHist.length > 0 && scoreHist.length > 1) {
      updateGameState("prev");
    }
  };

  return {
    handleDirectionClick,
    handleReset,
    handlePrev,
  };
}
