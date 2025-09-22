import { useEffect, useState } from "react";

const CELL_SIZE = 40;
const CELL_MARGIN = 2;
const CELL_TOTAL_SIZE = CELL_SIZE + CELL_MARGIN * 2;

// AnimatedCell 컴포넌트
function AnimatedCell({ transition }) {
  const [position, setPosition] = useState({
    x: transition.prev
      ? transition.prev[1] * CELL_TOTAL_SIZE
      : transition.cur
      ? transition.cur[1] * CELL_TOTAL_SIZE
      : 0,
    y: transition.prev
      ? transition.prev[0] * CELL_TOTAL_SIZE
      : transition.cur
      ? transition.cur[0] * CELL_TOTAL_SIZE
      : 0,
  });
  const [scale, setScale] = useState(transition.isNew ? 0 : 1);
  const [opacity, setOpacity] = useState(transition.cur === null ? 0 : 1);

  const colors = {
    0: { bg: "#fff", color: "#776e65" },
    2: { bg: "#ff0000", color: "#fff" },
    4: { bg: "#ff7f00", color: "#fff" },
    8: { bg: "#ffff00", color: "#776e65" },
    16: { bg: "#00ff00", color: "#fff" },
    32: { bg: "#0000ff", color: "#fff" },
    64: { bg: "#4b0082", color: "#fff" },
    128: { bg: "#8b00ff", color: "#fff" },
    256: { bg: "#ff69b4", color: "#fff" },
    512: { bg: "#00ced1", color: "#fff" },
    1024: { bg: "#ffd700", color: "#776e65" },
    2048: { bg: "#9400d3", color: "#fff" },
  };

  useEffect(() => {
    // 애니메이션 시작
    const timer = setTimeout(() => {
      if (transition.cur && transition.prev) {
        // 이동 애니메이션
        setPosition({
          x: transition.cur[1] * CELL_TOTAL_SIZE,
          y: transition.cur[0] * CELL_TOTAL_SIZE,
        });
      }

      if (transition.isNew) {
        // 새 블록 등장 애니메이션
        setScale(1);
        setOpacity(1);
        // 병합된 블록의 경우 살짝 더 크게 만들었다가 원래 크기로
        if (!transition.prev) {
          setTimeout(() => setScale(1.1), 50);
          setTimeout(() => setScale(1), 150);
        }
      }

      if (transition.cur === null) {
        // 블록 사라짐 애니메이션
        setOpacity(0);
        setScale(0.8);
      }
    }, 10); // 작은 지연으로 CSS 트랜지션 트리거

    return () => clearTimeout(timer);
  }, [transition]);

  // 새로 생성되거나 사라지는 블록의 경우 이동하지 않음
  if (transition.prev === null && transition.cur !== null) {
    // 새 블록
  } else if (transition.cur === null) {
    // 사라지는 블록
  }

  const cellStyle = {
    position: "absolute",
    width: CELL_SIZE,
    height: CELL_SIZE,
    border: "1px solid #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: colors[transition.value]?.bg || "#3c3a32",
    color: colors[transition.value]?.color || "#776e65",
    fontWeight: "bold",
    fontSize:
      transition.value < 8
        ? "20px"
        : transition.value < 128
        ? "18px"
        : transition.value < 1024
        ? "16px"
        : "14px",
    borderRadius: "3px",
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
    opacity: opacity,
    transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
    zIndex: transition.isNew ? 2 : 1,
  };

  return <div style={cellStyle}>{transition.value}</div>;
}

export default AnimatedCell;
