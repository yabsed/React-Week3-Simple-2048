import Cell from "./Cell";

// Board 컴포넌트
function Board({ board }) {
  return (
    <div>
      {board.map((row, i) => (
        <div key={i} style={{ display: "flex" }}>
          {row.map((cell, j) => (
            <Cell key={j} value={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
