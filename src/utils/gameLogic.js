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

// ======================================= //

// Rotate board 90 degrees clockwise
const rotateBoard = (board) => {
  return board[0].map((_, colIndex) =>
    board.map((row) => row[colIndex]).reverse()
  );
};

// Rotate transition coordinates for one rotation
const rotateTransitions = (transitions) =>
  transitions.map((tr) => ({
    ...tr,
    prev: tr.prev && [tr.prev[1], BOARD_SIZE - 1 - tr.prev[0]],
    cur: tr.cur && [tr.cur[1], BOARD_SIZE - 1 - tr.cur[0]],
  }));

// Rotate board and transitions together 'times' times
const rotateWithTransitions = (board, transitions, times) => {
  for (let i = 0; i < times; i++) {
    board = rotateBoard(board);
    transitions = rotateTransitions(transitions);
  }
  return { board, transitions };
};

const moveAndMergeLeftWithTransitions = (board) => {
  const transitions = [];
  let totalScore = 0;
  let id = 0;

  const newBoard = board.map((row, rowIndex) => {
    // 필터링: 0이 아닌 값만 추출
    const filtered = row
      .map((value, colIndex) => ({ value, colIndex }))
      .filter((cell) => cell.value !== 0);

    const merged = [];
    let i = 0;
    while (i < filtered.length) {
      if (
        i + 1 < filtered.length &&
        filtered[i].value === filtered[i + 1].value
      ) {
        // 병합
        const mergedValue = filtered[i].value * 2;
        totalScore += mergedValue;

        transitions.push({
          id: id++,
          value: filtered[i].value,
          prev: [rowIndex, filtered[i].colIndex],
          cur: [rowIndex, merged.length],
        });
        transitions.push({
          id: id++,
          value: filtered[i + 1].value,
          prev: [rowIndex, filtered[i + 1].colIndex],
          cur: [rowIndex, merged.length],
        });
        transitions.push({
          id: id++,
          value: mergedValue,
          prev: null,
          cur: [rowIndex, merged.length],
          isNew: true,
        });

        merged.push(mergedValue);
        i += 2;
      } else {
        transitions.push({
          id: id++,
          value: filtered[i].value,
          prev: [rowIndex, filtered[i].colIndex],
          cur: [rowIndex, merged.length],
        });
        merged.push(filtered[i].value);
        i += 1;
      }
    }

    while (merged.length < board.length) merged.push(0);
    return merged;
  });

  return { board: newBoard, transitions, score: totalScore };
};

export const getMoveTransitions = (board, dir) => {
  const rotations = { up: 3, right: 2, down: 1, left: 0 }[dir] || 0;
  const backRotations = (4 - rotations) % 4;

  // Rotate board and transitions
  let { board: rotatedBoard, transitions } = rotateWithTransitions(
    board.map((row) => row.slice()),
    [],
    rotations
  );

  // Move and merge left with transitions
  const {
    board: movedBoard,
    transitions: moveTransitions,
    score,
  } = moveAndMergeLeftWithTransitions(rotatedBoard);

  // Rotate back
  let { board: finalBoard, transitions: finalTransitions } =
    rotateWithTransitions(movedBoard, moveTransitions, backRotations);

  // Add new block if board changed
  if (!isBoardEqual(board, finalBoard)) {
    addNewBlockWithTransition(finalBoard, finalTransitions);
  }

  return {
    movedBoard: finalBoard,
    transitions: finalTransitions,
    score,
  };
};

// Add new block with transition if board changed
const addNewBlockWithTransition = (board, transitions) => {
  // emptyCells
  const emptyCells = getEmptyCells(board);
  if (!emptyCells.length) return;

  // row, col
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  // newValue
  const newValue = Math.random() < 0.9 ? 2 : 4;

  // update board
  board[row][col] = newValue;

  // update transition
  transitions.push({
    id: transitions.length ? Math.max(...transitions.map((t) => t.id)) + 1 : 0,
    value: newValue,
    prev: null,
    cur: [row, col],
    isNew: true,
  });
};
