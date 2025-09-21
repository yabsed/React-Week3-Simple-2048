import { useEffect, useState } from "react";
import { initMap, updateMap } from "../utils/gameLogic";

function getLocalStorage(key, defaultValue) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
}

export function useGameState() {
  const [boardHist, setBoardHist] = useState(getLocalStorage("boardHist", []));
  const [scoreHist, setScoreHist] = useState(getLocalStorage("scoreHist", [0]));
  const [board, setBoard] = useState(getLocalStorage("boardState", initMap()));
  const [score, setScore] = useState(getLocalStorage("scoreState", 0));

  // 로컬스토리지 동기화
  useEffect(() => {
    localStorage.setItem("boardHist", JSON.stringify(boardHist));
    localStorage.setItem("scoreHist", JSON.stringify(scoreHist));
    localStorage.setItem("boardState", JSON.stringify(board));
    localStorage.setItem("scoreState", JSON.stringify(score));
  }, [boardHist, scoreHist, board, score]);

  // 게임 상태 업데이트 함수
  const updateGameState = (dir) => {
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

  return {
    board,
    score,
    boardHist,
    scoreHist,
    updateGameState,
  };
}
