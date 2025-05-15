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
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            isWinningSquare={winningSquares.includes(index)}
          />
        ))}
      </div>
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
  const [mode, setMode] = useState('pvp');
  const [pveFirst, setPveFirst] = useState('human');
  const [pvpFirst, setPvpFirst] = useState('player1'); // 新增PVP先手
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // 记录当前对局先后手
  const humanMark = mode === 'pve' ? (pveFirst === 'human' ? 'X' : 'O') : null;
  const aiMark = mode === 'pve' ? (pveFirst === 'human' ? 'O' : 'X') : null;
  const pvpFirstMark = pvpFirst === 'player1' ? 'X' : 'O';
  const pvpSecondMark = pvpFirst === 'player1' ? 'O' : 'X';

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
    let result = `(${mode.toUpperCase()}) ${boardSize}x${boardSize}`;
    if (mode === 'pve') {
      result += `, Human(${humanMark}) vs AI(${aiMark})`;
      if (winner) {
        if (winner === humanMark) {
          result += `, Winner: Human(${winner})`;
        } else {
          result += `, Winner: AI(${winner})`;
        }
      } else if (isDraw(currentSquares, boardSize)) {
        result += ', Draw';
      }
    } else {
      result += `, Player1(${pvpFirstMark}) vs Player2(${pvpSecondMark})`;
      if (winner) {
        if (winner === pvpFirstMark) {
          result += `, Winner: Player1(${winner})`;
        } else {
          result += `, Winner: Player2(${winner})`;
        }
      } else if (isDraw(currentSquares, boardSize)) {
        result += ', Draw';
      }
    }
    setGameResults([...gameResults, result]);
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

  function handlePveFirstChange(e) {
    setPveFirst(e.target.value);
    setHistory([Array(boardSize * boardSize).fill(null)]);
    setCurrentMove(0);
  }

  function handlePvpFirstChange(e) {
    setPvpFirst(e.target.value);
    setHistory([Array(boardSize * boardSize).fill(null)]);
    setCurrentMove(0);
  }

  // 统计胜率
  const pvpStats = { total: 0, player1: 0, player2: 0, draw: 0 };
  const pveStats = { total: 0, human: 0, ai: 0, draw: 0 };
  gameResults.forEach(result => {
    if (result.startsWith('(PVP')) {
      pvpStats.total++;
      if (result.includes('Winner: Player1')) pvpStats.player1++;
      else if (result.includes('Winner: Player2')) pvpStats.player2++;
      else if (result.includes('Draw')) pvpStats.draw++;
    } else if (result.startsWith('(PVE')) {
      pveStats.total++;
      if (result.includes('Winner: Human')) pveStats.human++;
      else if (result.includes('Winner: AI')) pveStats.ai++;
      else if (result.includes('Draw')) pveStats.draw++;
    }
  });
  pvpStats.winRate1 = pvpStats.total ? (pvpStats.player1 / pvpStats.total * 100).toFixed(1) : '0.0';
  pvpStats.winRate2 = pvpStats.total ? (pvpStats.player2 / pvpStats.total * 100).toFixed(1) : '0.0';
  pveStats.winRateHuman = pveStats.total ? (pveStats.human / pveStats.total * 100).toFixed(1) : '0.0';
  pveStats.winRateAI = pveStats.total ? (pveStats.ai / pveStats.total * 100).toFixed(1) : '0.0';

  // AI自动落子副作用
  React.useEffect(() => {
    if (mode === 'pve' && !calculateWinner(currentSquares, boardSize).winner && !isDraw(currentSquares, boardSize)) {
      // 判断当前轮到谁
      const aiTurn = (pveFirst === 'human' && !xIsNext) || (pveFirst === 'ai' && xIsNext);
      if (aiTurn) {
        const aiMove = getAIMove(currentSquares, boardSize, aiMark);
        if (aiMove !== null) {
          const nextSquares = currentSquares.slice();
          nextSquares[aiMove] = aiMark;
          handlePlay(nextSquares);
        }
      }
    }
  }, [mode, currentSquares, xIsNext, boardSize, pveFirst]);

  // PVE且AI先手时，自动AI首落
  React.useEffect(() => {
    if (mode === 'pve' && pveFirst === 'ai' && history.length === 1 && history[0].every(sq => sq === null)) {
      const aiMove = getAIMove(history[0], boardSize, aiMark);
      if (aiMove !== null) {
        const nextSquares = history[0].slice();
        nextSquares[aiMove] = aiMark;
        setHistory([history[0], nextSquares]);
        setCurrentMove(1);
      }
    }
    // eslint-disable-next-line
  }, [mode, boardSize, pveFirst]);

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

  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="game-title">Tic Tac Toe</h1>
      </header>
      {/* 上半部分：主游戏内容 */}
      <div className="game-top">
        <div className="game-settings">
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
          {mode === 'pvp' && (
            <div className="pvp-first-selector" style={{ marginTop: '10px' }}>
              <label htmlFor="pvp-first">First Move: </label>
              <select id="pvp-first" value={pvpFirst} onChange={handlePvpFirstChange}>
                <option value="player1">Player1 (X)</option>
                <option value="player2">Player2 (X)</option>
              </select>
            </div>
          )}
          {mode === 'pve' && (
            <div className="pve-first-selector" style={{ marginTop: '10px' }}>
              <label htmlFor="pve-first">First Move: </label>
              <select id="pve-first" value={pveFirst} onChange={handlePveFirstChange}>
                <option value="human">Human First ({pveFirst === 'human' ? 'X' : 'O'})</option>
                <option value="ai">AI First ({pveFirst === 'ai' ? 'X' : 'O'})</option>
              </select>
            </div>
          )}
        </div>
        <div className="game-board-area">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} boardSize={boardSize} />
          {(calculateWinner(currentSquares, boardSize).winner || isDraw(currentSquares, boardSize)) && (
            <button onClick={handleRematch} className="rematch-button">Rematch</button>
          )}
        </div>
      </div>
      {/* 下半部分：统计内容 */}
      <div className="game-bottom">
        <div className="game-stats-summary">
          <h3 style={{ margin: '0 0 8px 0' }}>Win Rate Summary</h3>
          <table style={{ width: '100%', fontSize: '0.95rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f7e7b7' }}>
                <th style={{ textAlign: 'left', padding: '2px 6px' }}>Mode</th>
                <th>Games</th>
                <th>Player1/Human</th>
                <th>Player2/AI</th>
                <th>Draw</th>
                <th>Win Rate1/Human</th>
                <th>Win Rate2/AI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PVP</td>
                <td>{pvpStats.total}</td>
                <td>{pvpStats.player1}</td>
                <td>{pvpStats.player2}</td>
                <td>{pvpStats.draw}</td>
                <td>{pvpStats.winRate1}%</td>
                <td>{pvpStats.winRate2}%</td>
              </tr>
              <tr>
                <td>PVE</td>
                <td>{pveStats.total}</td>
                <td>{pveStats.human}</td>
                <td>{pveStats.ai}</td>
                <td>{pveStats.draw}</td>
                <td>{pveStats.winRateHuman}%</td>
                <td>{pveStats.winRateAI}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="game-stats">
          <h3>Stats Tracking</h3>
          <ul>
            {gameResults.map((result, index) => (
              <li key={index}>Game {index + 1}: {result}</li>
            ))}
          </ul>
        </div>
        <div className="game-moves">
          <h3>Moves</h3>
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
}