import { useState } from 'react'
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

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).winner) {
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

  const { winner, winningSquares } = calculateWinner(squares);
  const draw = isDraw(squares);
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
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} isWinningSquare={winningSquares.includes(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} isWinningSquare={winningSquares.includes(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} isWinningSquare={winningSquares.includes(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} isWinningSquare={winningSquares.includes(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} isWinningSquare={winningSquares.includes(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} isWinningSquare={winningSquares.includes(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} isWinningSquare={winningSquares.includes(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} isWinningSquare={winningSquares.includes(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} isWinningSquare={winningSquares.includes(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return { winner: null, winningSquares: [] };
}

function isDraw(squares) {
  return squares.every(square => square !== null);
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [gameResults, setGameResults] = useState([]);
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
    const winner = calculateWinner(currentSquares).winner;
    if (winner) {
      setGameResults([...gameResults, `${winner} won`]);
    } else if (isDraw(currentSquares)) {
      setGameResults([...gameResults, "Draw"]);
    }
    setHistory([Array(9).fill(null)]);
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

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {(calculateWinner(currentSquares).winner || isDraw(currentSquares)) && (
          <button onClick={handleRematch}>Rematch</button>
        )}
        <ol>{moves}</ol>
        <div className="game-results">
          <h3>Game History</h3>
          <ul>
            {gameResults.map((result, index) => (
              <li key={index}>Game {index + 1}: {result}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}