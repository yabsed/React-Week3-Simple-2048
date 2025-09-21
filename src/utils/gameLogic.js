// src/utils/gameLogic.js

export const BOARD_SIZE = 4;

const rotate = (board, times = 1) => {
  let rotated = board;
  for (let t = 0; t < times; t++) {
    rotated = rotated[0].map((_, i) => rotated.map((row) => row[i]).reverse());
  }
  return rotated;
};

const moveAndMergeLeft = (board) => {
  return board.map((row) => {
    const filtered = row.filter((cell) => cell !== 0);
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered[i + 1] = 0;
      }
    }
    const merged = filtered.filter((cell) => cell !== 0);
    while (merged.length < BOARD_SIZE) merged.push(0);
    return merged;
  });
};

export const move = (board, dir) => {
  let workingBoard = board.map((row) => row.slice());

  // Rotate board to simplify movement logic
  if (dir === "up") workingBoard = rotate(workingBoard, 3);
  if (dir === "right") workingBoard = rotate(workingBoard, 2);
  if (dir === "down") workingBoard = rotate(workingBoard, 1);

  // Move and merge left
  workingBoard = moveAndMergeLeft(workingBoard);

  // Rotate back to original orientation
  if (dir === "up") workingBoard = rotate(workingBoard, 1);
  if (dir === "right") workingBoard = rotate(workingBoard, 2);
  if (dir === "down") workingBoard = rotate(workingBoard, 3);

  return workingBoard;
};

// ====================================== //

export const isBoardEqual = (boardA, boardB) => {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      console.log("Why");
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

export const getScore = (board) => {
  return board.flat().reduce((sum, cell) => sum + cell, 0);
};

export const emptyMap = () => {
  return Array(4)
    .fill()
    .map(() => Array(BOARD_SIZE).fill(0));
};

export const initMap = () => {
  const boardWithOneBlock = getBoardWithNewBlock(emptyMap());
  const boardWithTwoBlocks = getBoardWithNewBlock(boardWithOneBlock);
  return boardWithTwoBlocks;
};

export const updateMap = (prevBoard, dir) => {
  const movedBoard = move(prevBoard, dir);
  return isBoardEqual(prevBoard, movedBoard)
    ? movedBoard
    : getBoardWithNewBlock(movedBoard);
};
