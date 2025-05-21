// useGameLogic.jsx —— 井字棋核心业务逻辑自定义 Hook，负责管理棋盘状态、落子、AI、比分、历史、持久化等所有对局相关功能。
// 游戏主逻辑 useGameLogic：管理棋盘、落子、AI、比分、历史等所有核心状态
import { useState, useEffect, useCallback } from 'react';
import { getAIMove } from '../utils/ai.jsx';
import { computeStatsFromResults } from '../utils/statUtils.jsx';
import { getGameData, setGameData } from '../utils/storage.jsx';

export function useGameLogic(initConfig) {
  // 读取 localStorage 或外部传入的 config 初始化
  const config = initConfig || (getGameData() && getGameData().config) || { mode: 'pvp', boardSize: 3, pveFirst: 'human', pvpFirst: 'player1' };
  const [boardSize, setBoardSize] = useState(config.boardSize || 3);
  const [mode, setMode] = useState(config.mode || 'pvp');
  const [pveFirst, setPveFirst] = useState(config.pveFirst || 'human');
  const [pvpFirst, setPvpFirst] = useState(config.pvpFirst || 'player1');
  // 读取 localStorage 的 moves 初始化 history
  const data = getGameData() || {};
  const [history, setHistory] = useState(Array.isArray(data.moves) && data.moves.length > 0 ? data.moves : [Array((config.boardSize || 3) * (config.boardSize || 3)).fill(null)]);
  const [currentMove, setCurrentMove] = useState((Array.isArray(data.moves) && data.moves.length > 0) ? data.moves.length - 1 : 0);
  // 初始化 gameResults 为 localStorage 里的历史结果
  const [gameResults, setGameResults] = useState(Array.isArray(data.results) ? data.results : []);

  // 读取当前对局计分板
  const currentScores = (getGameData() && getGameData().currentScores) || { pvp: { player1: 0, player2: 0, draw: 0 }, pve: { human: 0, ai: 0, draw: 0 } };

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
    // --- 新增：每次落子都保存 moves 到 localStorage ---
    setGameData({
      ...getGameData(),
      moves: nextHistory,
    });
  }, [history, currentMove]);

  const jumpTo = useCallback((nextMove) => {
    setCurrentMove(nextMove);
    // --- 新增：每次跳转也保存 moves 到 localStorage ---
    setGameData({
      ...getGameData(),
      moves: history,
    });
  }, [history]);

  // handleRematch 时只更新 currentScores，不动历史
  const handleRematch = useCallback(() => {
    const winner = calculateWinner(currentSquares, boardSize).winner;
    let result = `(${mode.toUpperCase()}) ${boardSize}x${boardSize}`;
    let newCurrentScores = { ...currentScores };
    if (mode === 'pve') {
      result += `, Human(${humanMark}) vs AI(${aiMark})`;
      if (winner) {
        if (winner === humanMark) {
          result += `, Winner: Human(${winner})`;
          newCurrentScores.pve.human += 1;
        } else {
          result += `, Winner: AI(${winner})`;
          newCurrentScores.pve.ai += 1;
        }
      } else if (isDraw(currentSquares, boardSize)) {
        result += ', Draw';
        newCurrentScores.pve.draw += 1;
      }
    } else {
      result += `, Player1(${pvpFirstMark}) vs Player2(${pvpSecondMark})`;
      if (winner) {
        if (winner === pvpFirstMark) {
          result += `, Winner: Player1(${winner})`;
          newCurrentScores.pvp.player1 += 1;
        } else {
          result += `, Winner: Player2(${winner})`;
          newCurrentScores.pvp.player2 += 1;
        }
      } else if (isDraw(currentSquares, boardSize)) {
        result += ', Draw';
        newCurrentScores.pvp.draw += 1;
      }
    }
    setGameResults(prev => [...prev, result]);
    setHistory([Array(boardSize * boardSize).fill(null)]);
    setCurrentMove(0);
    // 只更新 currentScores
    setGameData({
      ...getGameData(),
      currentScores: newCurrentScores,
    });
  }, [currentSquares, boardSize, mode, humanMark, aiMark, pvpFirstMark, pvpSecondMark, isDraw, calculateWinner, currentScores]);

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

  // --- 新增副作用：对局结果持久化到 localStorage ---
  // 只在 gameResults 变化时同步
  useEffect(() => {
    const data = getGameData() || {};
    // 兼容新版 computeStatsFromResults 返回结构
    const stats = computeStatsFromResults(gameResults);
    setGameData({
      ...data,
      results: gameResults,
      scores: stats.pvp && stats.pve ? { pvp: stats.pvp, pve: stats.pve } : (data.scores || {}),
    });
  }, [gameResults]);

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
    pveStats,
    currentScores
  };
}
