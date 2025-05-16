import React from 'react';
import Board from './components/Board';
import Moves from './components/Moves';
import SettingsPanel from './components/SettingsPanel';
import Stats from './components/Stats';
import { useGameLogic } from './hooks/useGameLogic';

export default function Game() {
  const {
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
    gameResults
  } = useGameLogic();

  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="game-title">Tic Tac Toe</h1>
      </header>
      {/* 上半部分：主游戏内容 */}
      <div className="game-top">
        <SettingsPanel
          boardSize={boardSize}
          mode={mode}
          pveFirst={pveFirst}
          pvpFirst={pvpFirst}
          handleBoardSizeChange={handleBoardSizeChange}
          handleModeChange={handleModeChange}
          handlePveFirstChange={handlePveFirstChange}
          handlePvpFirstChange={handlePvpFirstChange}
        />
        <div className="game-board-area">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            boardSize={boardSize}
            calculateWinner={calculateWinner}
            isDraw={isDraw}
          />
          {(calculateWinner(currentSquares, boardSize).winner || isDraw(currentSquares, boardSize)) && (
            <button onClick={handleRematch} className="rematch-button">Rematch</button>
          )}
        </div>
      </div>
      {/* 下半部分：统计内容 */}
      <div className="game-bottom">
        <Stats pvpStats={pvpStats} pveStats={pveStats} gameResults={gameResults} />
        <Moves moves={moves} jumpTo={jumpTo} />
      </div>
    </div>
  );
}