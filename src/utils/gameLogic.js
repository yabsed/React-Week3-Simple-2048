// src/utils/gameLogic.js

export const BOARD_SIZE = 4;
export const WINNING_COND = 128;

const rotate = (board) => {
  return board[0].map((_, i) => board.map((row) => row[i]).reverse());
};

const moveAndMergeLeft = (board) => {
  let totalScore = 0;
  const newBoard = board.map((row) => {
    const filtered = row.filter((cell) => cell !== 0);
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        totalScore += filtered[i]; // 합쳐진 블록의 점수를 누적
        filtered[i + 1] = 0;
      }
    }
    const merged = filtered.filter((cell) => cell !== 0);
    while (merged.length < BOARD_SIZE) merged.push(0);
    return merged;
  });

  return { board: newBoard, score: totalScore };
};

export const move = (board, dir) => {
  let workingBoard = board.map((row) => row.slice());

  // Rotate board to simplify movement logic
  if (dir === "up") workingBoard = rotate(rotate(rotate(workingBoard)));
  if (dir === "right") workingBoard = rotate(rotate(workingBoard));
  if (dir === "down") workingBoard = rotate(workingBoard);

  // Move and merge left
  const result = moveAndMergeLeft(workingBoard);
  workingBoard = result.board;
  const score = result.score;

  // Rotate back to original orientation
  if (dir === "up") workingBoard = rotate(workingBoard);
  if (dir === "right") workingBoard = rotate(rotate(workingBoard));
  if (dir === "down") workingBoard = rotate(rotate(rotate(workingBoard)));

  return { board: workingBoard, score: score };
};

// ====================================== //

export const isBoardEqual = (boardA, boardB) => {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (boardA[i][j] !== boardB[i][j]) return false;
    }
  }
  return true;
};

// ====================================== //

const getEmptyCells = (board) => {
  const emptyCells = [];

  board.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell === 0) emptyCells.push([i, j]);
    })
  );
  return emptyCells;
};

const isFull = (board) => {
  return getEmptyCells(board).length === 0;
};

export const getBoardWithNewBlock = (board) => {
  if (isFull(board)) {
    return board; // 빈 칸이 없으면 그대로 반환
  }

  const emptyCells = getEmptyCells(board);

  // fix point
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const [row, col] = emptyCells[randomIndex];

  // fix value
  const newValue = Math.random() < 0.9 ? 2 : 4;

  // copy and modify
  const newBoard = board.map((arr) => arr.slice());
  newBoard[row][col] = newValue;

  return newBoard;
};

export const emptyMap = () => {
  return Array(BOARD_SIZE)
    .fill()
    .map(() => Array(BOARD_SIZE).fill(0));
};

export const initMap = () => {
  const boardWithOneBlock = getBoardWithNewBlock(emptyMap());
  const boardWithTwoBlocks = getBoardWithNewBlock(boardWithOneBlock);
  return boardWithTwoBlocks;
};

export const updateMap = (prevBoard, dir) => {
  const moveResult = move(prevBoard, dir);
  const movedBoard = moveResult.board;

  return isBoardEqual(prevBoard, movedBoard)
    ? { board: movedBoard, score: moveResult.score }
    : { board: getBoardWithNewBlock(movedBoard), score: moveResult.score };
};

// =========================================== //

export const isLost = (board) => {
  const directions = ["up", "down", "left", "right"];
  for (let dir of directions) {
    const moveResult = move(board, dir);
    const movedBoard = moveResult.board;
    if (!isBoardEqual(board, movedBoard)) {
      return false; // At least one move is possible
    }
  }
  return true; // No moves possible, game is lost
};

export const isWon = (board) => {
  return board.flat().some((cell) => cell >= WINNING_COND);
};

export const judge = (board) => {
  if (isWon(board)) return "won";
  if (isLost(board)) return "lost";
  return "continue";
};

export const getMoveTransitions = (board, dir) => {
  let tileIdCounter = 0;

  const size = board.length;
  const transitions = [];
  const movedBoard = Array(size)
    .fill(0)
    .map(() => Array(size).fill(0));
  let score = 0;

  const isHorizontal = dir === "left" || dir === "right";
  const isForward = dir === "right" || dir === "down";

  for (let i = 0; i < size; i++) {
    // 1. 한 줄(행 또는 열)씩 처리
    const lineCoords = [];
    for (let j = 0; j < size; j++) {
      lineCoords.push(isHorizontal ? [i, j] : [j, i]);
    }

    let tileObjects = lineCoords
      .map(([r, c]) => ({ value: board[r][c], r, c }))
      .filter((t) => t.value !== 0);

    if (isForward) {
      tileObjects.reverse();
    }

    // 2. 타일 병합
    const mergedTiles = [];
    for (let j = 0; j < tileObjects.length; j++) {
      if (
        j + 1 < tileObjects.length &&
        tileObjects[j].value === tileObjects[j + 1].value
      ) {
        const survivor = tileObjects[j];
        const victim = tileObjects[j + 1];

        survivor.value *= 2;
        score += survivor.value;

        // 사라질 타일(victim) 정보를 survivor에 임시 저장
        survivor.mergedFrom = victim;

        mergedTiles.push(survivor);
        j++; // victim 타일은 건너뜀
      } else {
        mergedTiles.push(tileObjects[j]);
      }
    }

    // 3. 새 위치 계산 및 전환 정보 객체 생성
    const newLineCoords = isForward ? lineCoords.slice().reverse() : lineCoords;

    mergedTiles.forEach((tile, index) => {
      const [newR, newC] = newLineCoords[index];
      movedBoard[newR][newC] = tile.value;

      // "합쳐져서 사라진 블록"에 대한 정보 추가
      if (tile.mergedFrom) {
        // 첫 번째 블록이 이동해서 합쳐짐
        transitions.push({
          id: tileIdCounter++,
          value: tile.value / 2, // 병합 전 원래 값
          prev: [tile.r, tile.c],
          cur: [newR, newC],
        });
        // 두 번째 블록이 이동해서 합쳐짐
        transitions.push({
          id: tileIdCounter++,
          value: tile.mergedFrom.value, // 병합 전 원래 값
          prev: [tile.mergedFrom.r, tile.mergedFrom.c],
          cur: [newR, newC],
        });
        // 새로운 합쳐진 블록이 나타남
        transitions.push({
          id: tileIdCounter++,
          value: tile.value,
          prev: null,
          cur: [newR, newC],
          isNew: true,
        });
      } else {
        transitions.push({
          id: tileIdCounter++,
          value: tile.value,
          prev: [tile.r, tile.c],
          cur: [newR, newC],
        });
      }
    });
  }

  const emptyCells = getEmptyCells(movedBoard);
  let finalBoard = movedBoard;
  if (emptyCells.length > 0) {
    // 새 블록 추가 위치와 값 추출
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    finalBoard = movedBoard.map((arr) => arr.slice());
    finalBoard[row][col] = newValue;

    // 새 블록의 transition 정보 추가
    transitions.push({
      id: tileIdCounter++,
      value: newValue,
      prev: null,
      cur: [row, col],
      isNew: true,
    });
  }

  return { movedBoard: finalBoard, transitions, score };
};
