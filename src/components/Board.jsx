// Board.jsx —— 棋盘组件，负责渲染棋盘、处理用户落子、显示当前状态（胜负/平局/下一步），支持任意棋盘大小。
import React from 'react';

function Board({ xIsNext, squares, onPlay, boardSize, calculateWinner, isDraw }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares, boardSize).winner) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const { winner, winningSquares } = calculateWinner(squares, boardSize);
  const draw = isDraw(squares, boardSize);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (draw) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status" style={{ width: '200px', textAlign: 'center' }}>{status}</div>
      <div
        className="board-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          gap: '0',
          width: 'min(90vw, 90vh, 480px)',
          aspectRatio: '1',
          maxWidth: '100%',
          margin: '0 auto',
        }}
      >
        {Array.from({ length: boardSize * boardSize }, (_, index) => (
          <button
            className={`square ${winningSquares.includes(index) ? 'winning-square' : ''}`}
            key={index}
            onClick={() => handleClick(index)}
          >
            {squares[index]}
          </button>
        ))}
      </div>
    </>
  );
}

export default Board;
