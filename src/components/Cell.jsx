// Cell 컴포넌트
function Cell({ value }) {
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
  const cellStyle = {
    width: 40,
    height: 40,
    border: "1px solid #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: colors[value]?.bg || "#3c3a32",
    color: colors[value]?.color || "#776e65",
    fontWeight: "bold",
    fontSize:
      value === 0
        ? "16px"
        : value < 8
        ? "20px"
        : value < 128
        ? "18px"
        : value < 1024
        ? "16px"
        : "14px",
  };

  return <div style={cellStyle}>{value !== 0 ? value : ""}</div>;
}

export default Cell;
