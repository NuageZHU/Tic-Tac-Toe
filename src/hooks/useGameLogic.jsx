import { useState, useEffect, useCallback } from 'react';
import { getAIMove } from '../utils/ai.jsx';
import { computeStatsFromResults } from '../utils/statUtils.jsx';

export function useGameLogic() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [gameResults, setGameResults] = useState([]);
  const [boardSize, setBoardSize] = useState(3);
  const [mode, setMode] = useState('pvp');
  const [pveFirst, setPveFirst] = useState('human');
  const [pvpFirst, setPvpFirst] = useState('player1');

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // 记录当前对局先后手
  const humanMark = mode === 'pve' ? (pveFirst === 'human' ? 'X' : 'O') : null;
  const aiMark = mode === 'pve' ? (pveFirst === 'human' ? 'O' : 'X') : null;
  const pvpFirstMark = pvpFirst === 'player1' ? 'X' : 'O';
  const pvpSecondMark = pvpFirst === 'player1' ? 'O' : 'X';

  // 计算胜负
  const calculateWinner = useCallback((squares, boardSize) => {
    const lines = [];
    for (let row = 0; row < boardSize; row++) {
      lines.push(Array.from({ length: boardSize }, (_, col) => row * boardSize + col));
    }
    for (let col = 0; col < boardSize; col++) {
      lines.push(Array.from({ length: boardSize }, (_, row) => row * boardSize + col));
    }
    lines.push(Array.from({ length: boardSize }, (_, i) => i * (boardSize + 1)));
    lines.push(Array.from({ length: boardSize }, (_, i) => (i + 1) * (boardSize - 1)));
    for (const line of lines) {
      const [first, ...rest] = line;
      if (squares[first] && rest.every((index) => squares[index] === squares[first])) {
        return { winner: squares[first], winningSquares: line };
      }
    }
    return { winner: null, winningSquares: [] };
  }, []);

  const isDraw = useCallback((squares, boardSize) => {
    const { winner } = calculateWinner(squares, boardSize);
    return !winner && squares.every(square => square !== null);
  }, [calculateWinner]);

  // 游戏操作
  const handlePlay = useCallback((nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }, [history, currentMove]);

  const jumpTo = useCallback((nextMove) => {
    setCurrentMove(nextMove);
  }, []);

  const handleRematch = useCallback(() => {
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
    setGameResults(prev => [...prev, result]);
    setHistory([Array(boardSize * boardSize).fill(null)]);
    setCurrentMove(0);
  }, [currentSquares, boardSize, mode, humanMark, aiMark, pvpFirstMark, pvpSecondMark, isDraw, calculateWinner]);

  const handleBoardSizeChange = useCallback((size) => {
    setBoardSize(size);
    setHistory([Array(size * size).fill(null)]);
    setCurrentMove(0);
  }, []);

  const handleModeChange = useCallback((e) => {
    setMode(e.target.value);
    setHistory([Array(boardSize * boardSize).fill(null)]);
    setCurrentMove(0);
  }, [boardSize]);

  const handlePveFirstChange = useCallback((e) => {
    setPveFirst(e.target.value);
    setHistory([Array(boardSize * boardSize).fill(null)]);
    setCurrentMove(0);
  }, [boardSize]);

  const handlePvpFirstChange = useCallback((e) => {
    setPvpFirst(e.target.value);
    setHistory([Array(boardSize * boardSize).fill(null)]);
    setCurrentMove(0);
  }, [boardSize]);

  // AI自动落子副作用
  useEffect(() => {
    if (mode === 'pve' && !calculateWinner(currentSquares, boardSize).winner && !isDraw(currentSquares, boardSize)) {
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
  }, [mode, currentSquares, xIsNext, boardSize, pveFirst, aiMark, calculateWinner, isDraw, handlePlay]);

  // PVE且AI先手时，自动AI首落
  useEffect(() => {
    if (mode === 'pve' && pveFirst === 'ai' && history.length === 1 && history[0].every(sq => sq === null)) {
      const aiMove = getAIMove(history[0], boardSize, aiMark);
      if (aiMove !== null) {
        const nextSquares = history[0].slice();
        nextSquares[aiMove] = aiMark;
        setHistory([history[0], nextSquares]);
        setCurrentMove(1);
      }
    }
  }, [mode, boardSize, pveFirst, aiMark, history]);

  // 生成 moves 列表数据，供 Moves 组件使用
  const moves = history.map((squares, move) => ({
    description: move > 0 ? 'Go to move #' + move : 'Go to game start',
    move
  }));

  // 胜率统计
  const { pvpStats, pveStats } = computeStatsFromResults(gameResults);

  return {
    history,
    currentMove,
    gameResults,
    boardSize,
    mode,
    pveFirst,
    pvpFirst,
    xIsNext,
    currentSquares,
    handlePlay,
    jumpTo,
    handleRematch,
    handleBoardSizeChange,
    handleModeChange,
    handlePveFirstChange,
    handlePvpFirstChange,
    calculateWinner,
    isDraw,
    moves,
    pvpStats,
    pveStats
  };
}
