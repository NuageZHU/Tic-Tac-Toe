// Moves.jsx —— 落子记录组件，负责展示每一步棋的描述，并支持点击回溯到任意历史步骤。
// 落子记录 Moves：显示每一步落子描述，可回溯
import React from 'react';

function Moves({ moves, jumpTo }) {
  return (
    <div className="game-moves">
      <h3>Moves</h3>
      <ol>
        {moves.map(({ description, move }, idx) => (
          <li key={move}>
            <button onClick={() => jumpTo(move)}>{description}</button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Moves;
