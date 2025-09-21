import React from "react";

function GameControls({ onDirectionClick, onReset, onPrev }) {
  return (
    <>
      <div>
        <button onClick={() => onDirectionClick("up")}>Up</button>
        <button onClick={() => onDirectionClick("down")}>Down</button>
        <button onClick={() => onDirectionClick("left")}>Left</button>
        <button onClick={() => onDirectionClick("right")}>Right</button>
      </div>
      <div>
        <button onClick={onReset}>Reset</button>
        <button onClick={onPrev}>Prev</button>
      </div>
    </>
  );
}

export default GameControls;
