import Cell from "./Cell";
import AnimatedCell from "./AnimatedCell";

const CELL_SIZE = 40;
const CELL_MARGIN = 1;
const CELL_TOTAL_SIZE = CELL_SIZE + CELL_MARGIN * 2;

// Board 컴포넌트
function Board({ board, transitions, isAnimating }) {
  const boardStyle = {
    position: "relative",
    width: CELL_TOTAL_SIZE * 4,
    height: CELL_TOTAL_SIZE * 4,
    backgroundColor: "#000",
    borderRadius: "0px",
    padding: "0px",
    margin: "10px auto",
  };

  return (
    <div style={boardStyle}>
      {/* 배경 그리드 */}
      {Array.from({ length: 16 }).map((_, index) => {
        const i = Math.floor(index / 4);
        const j = index % 4;
        return (
          <div
            key={`bg_${i}_${j}`}
            style={{
              position: "absolute",
              transform: `translate(${j * CELL_TOTAL_SIZE}px, ${i * CELL_TOTAL_SIZE}px)`,
              width: CELL_SIZE,
              height: CELL_SIZE,
              margin: CELL_MARGIN,
              backgroundColor: "#fff",
              borderRadius: "0px",
              border: "1px solid #000",
            }}
          />
        );
      })}
      {/* 정적 타일들 (애니메이션이 없을 때) */}
      {!isAnimating &&
        board.map((row, i) =>
          row.map((cell, j) => {
            if (cell !== 0) {
              return (
                <div
                  key={`static_${i}_${j}`}
                  style={{
                    position: "absolute",
                    transform: `translate(${
                      j * CELL_TOTAL_SIZE + CELL_MARGIN
                    }px, ${i * CELL_TOTAL_SIZE + CELL_MARGIN}px)`,
                  }}
                >
                  <Cell value={cell} />
                </div>
              );
            }
            return null;
          })
        )}

      {/* 애니메이션 타일들 */}
      {isAnimating &&
        transitions.map((transition) => (
          <AnimatedCell key={transition.id} transition={transition} />
        ))}
    </div>
  );
}

export default Board;
