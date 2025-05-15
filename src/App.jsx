import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? 'winning-square' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, boardSize }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares, boardSize).winner) {
      return;
    } // If the square is already filled, do nothing

    const nextSquares = squares.slice(); // Create a copy of the squares array
    
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

  const rows = Array.from({ length: boardSize }, (_, rowIndex) => (
    <div className="board-row" key={rowIndex}>
      {Array.from({ length: boardSize }, (_, colIndex) => {
        const index = rowIndex * boardSize + colIndex;
        return (
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            isWinningSquare={winningSquares.includes(index)}
          />
        );
      })}
    </div>
  ));

  return (
    <>
      <div className="status" style={{ width: '200px', textAlign: 'center' }}>{status}</div>
      {rows}
    </>
  );
}

function calculateWinner(squares, boardSize) {
  const lines = [];

  // Rows
  for (let row = 0; row < boardSize; row++) {
    lines.push(Array.from({ length: boardSize }, (_, col) => row * boardSize + col));
  }

  // Columns
  for (let col = 0; col < boardSize; col++) {
    lines.push(Array.from({ length: boardSize }, (_, row) => row * boardSize + col));
  }

  // Diagonals
  lines.push(Array.from({ length: boardSize }, (_, i) => i * (boardSize + 1))); // ↘️
  lines.push(Array.from({ length: boardSize }, (_, i) => (i + 1) * (boardSize - 1))); // ↙️

  for (const line of lines) {
    const [first, ...rest] = line;
    if (squares[first] && rest.every((index) => squares[index] === squares[first])) {
      return { winner: squares[first], winningSquares: line };
    }
  }

  return { winner: null, winningSquares: [] };
}

function isDraw(squares, boardSize) {
  const { winner } = calculateWinner(squares, boardSize);
  return !winner && squares.every(square => square !== null);
}

// AI 落子逻辑：优先取胜 > 阻挡对方 > 随机
function getAIMove(squares, boardSize, aiMark) {
  const opponentMark = aiMark === 'X' ? 'O' : 'X';
  // 1. 检查AI是否能直接获胜
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      const test = squares.slice();
      test[i] = aiMark;
      if (calculateWinner(test, boardSize).winner === aiMark) {
        return i;
      }
    }
  }
  // 2. 检查是否需要阻挡对方获胜
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      const test = squares.slice();
      test[i] = opponentMark;
      if (calculateWinner(test, boardSize).winner === opponentMark) {
        return i;
      }
    }
  }
  // 3. 否则随机落子
  const empty = squares.map((v, i) => v ? null : i).filter(i => i !== null);
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [gameResults, setGameResults] = useState([]);
  const [boardSize, setBoardSize] = useState(3);
  const [mode, setMode] = useState('pvp'); // 新增对战模式状态
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleRematch() {
    const winner = calculateWinner(currentSquares, boardSize).winner;
    if (winner) {
      setGameResults([...gameResults, `(${boardSize}x${boardSize}): ${winner} won`]);
    } else if (isDraw(currentSquares, boardSize)) {
      setGameResults([...gameResults, `(${boardSize}x${boardSize}): Draw`]);
    }
    setHistory([Array(boardSize * boardSize).fill(null)]);
    setCurrentMove(0);
  }

  function handleBoardSizeChange(size) {
    setBoardSize(size);
    setHistory([Array(size * size).fill(null)]);
    setCurrentMove(0);
  }

  function handleModeChange(e) {
    setMode(e.target.value);
    setHistory([Array(boardSize * boardSize).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // AI自动落子副作用
  React.useEffect(() => {
    if (mode === 'pve' && !calculateWinner(currentSquares, boardSize).winner && !isDraw(currentSquares, boardSize)) {
      // 轮到AI且AI为O（玩家总是X先手）
      if (!xIsNext) {
        const aiMove = getAIMove(currentSquares, boardSize, 'O');
        if (aiMove !== null) {
          const nextSquares = currentSquares.slice();
          nextSquares[aiMove] = 'O';
          handlePlay(nextSquares);
        }
      }
    }
  }, [mode, currentSquares, xIsNext, boardSize]);

  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="game-title">Tic Tac Toe</h1>
      </header>
      <div className="game-content">
        <div className="game-left">
          <div className="board-options">
            <div className="board-size-selector">
              <label htmlFor="board-size">Select Board Size: </label>
              <select
                id="board-size"
                value={boardSize}
                onChange={(e) => handleBoardSizeChange(Number(e.target.value))}
              >
                <option value={3}>3x3</option>
                <option value={4}>4x4</option>
                <option value={5}>5x5</option>
                <option value={6}>6x6</option>
                <option value={7}>7x7</option>
                <option value={8}>8x8</option>
              </select>
            </div>
            <div className="mode-selector" style={{ marginTop: '10px' }}>
              <label htmlFor="mode">Mode: </label>
              <select id="mode" value={mode} onChange={handleModeChange}>
                <option value="pvp">PVP (Player vs Player)</option>
                <option value="pve">PVE (Player vs AI)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} boardSize={boardSize} />
          {(calculateWinner(currentSquares, boardSize).winner || isDraw(currentSquares, boardSize)) && (
            <button onClick={handleRematch} className="rematch-button">Rematch</button>
          )}
        </div>

        <div className="game-side">
          <div className="game-moves">
            <h3>Moves</h3>
            <ol>{moves}</ol>
          </div>
          <div className="game-stats">
            <h3>Stats Tracking</h3>
            <ul>
              {gameResults.map((result, index) => (
                <li key={index}>Game {index + 1}: {result}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}