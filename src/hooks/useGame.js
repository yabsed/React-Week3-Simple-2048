import { useEffect, useState } from "react";
import {
  initMap,
  updateMap,
  getMoveTransitions,
  judge,
  isBoardEqual,
} from "../utils/gameLogic";

function getLocalStorage(key, defaultValue) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
}

export function useGame() {
  const [boardHist, setBoardHist] = useState(getLocalStorage("boardHist", []));
  const [scoreHist, setScoreHist] = useState(getLocalStorage("scoreHist", [0]));
  const [board, setBoard] = useState(getLocalStorage("boardState", initMap()));
  const [score, setScore] = useState(getLocalStorage("scoreState", 0));
  const [transitions, setTransitions] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // 로컬스토리지 동기화
  useEffect(() => {
    localStorage.setItem("boardHist", JSON.stringify(boardHist));
    localStorage.setItem("scoreHist", JSON.stringify(scoreHist));
    localStorage.setItem("boardState", JSON.stringify(board));
    localStorage.setItem("scoreState", JSON.stringify(score));
  }, [boardHist, scoreHist, board, score]);

  // 게임 상태 업데이트 함수
  const updateGameState = (dir) => {
    if (isAnimating) return; // 애니메이션 중에는 이동 방지

    switch (dir) {
      case "reset":
        setBoard(initMap());
        setScore(0);
        setBoardHist([]);
        setScoreHist([0]);
        setTransitions([]);
        break;
      case "prev":
        if (boardHist.length > 0 && scoreHist.length > 1) {
          setBoard(boardHist[boardHist.length - 1]);
          setScore(scoreHist[scoreHist.length - 2]);
          setBoardHist(boardHist.slice(0, -1));
          setScoreHist(scoreHist.slice(0, -1));
          setTransitions([]);
        }
        break;
      default: {
        const {
          movedBoard: newBoard,
          transitions: newTransitions,
          score: addedScore,
        } = getMoveTransitions(board, dir);

        if (!isBoardEqual(newBoard, board)) {
          setBoardHist((history) => [...history, board]);
          setScoreHist((history) => [...history, score]);

          // 애니메이션 시작
          setIsAnimating(true);
          setTransitions(newTransitions);

          // 애니메이션 완료 후 보드 업데이트
          setTimeout(() => {
            setBoard(newBoard);
            setScore((prevScore) => prevScore + addedScore);
            setIsAnimating(false);
            setTransitions([]);
          }, 300); // 300ms 애니메이션 시간
        }
        break;
      }
    }
  };

  // 컨트롤 핸들러들
  const handleReset = () => {
    updateGameState("reset");
  };

  const handlePrev = () => {
    if (boardHist.length > 0 && scoreHist.length > 1) {
      updateGameState("prev");
    }
  };

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (judge(board) !== "continue" || isAnimating) return;

      if (e.key === "w" || e.key === "ArrowUp") updateGameState("up");
      if (e.key === "s" || e.key === "ArrowDown") updateGameState("down");
      if (e.key === "a" || e.key === "ArrowLeft") updateGameState("left");
      if (e.key === "d" || e.key === "ArrowRight") updateGameState("right");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, isAnimating]);

  return {
    board,
    score,
    boardHist,
    scoreHist,
    transitions,
    isAnimating,
    handleReset,
    handlePrev,
  };
}
