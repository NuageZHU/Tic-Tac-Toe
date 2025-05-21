// GamePage.jsx —— 对局主页面，负责渲染棋盘、比分、落子记录、先后手选择等所有对局相关交互，支持本地持久化和多种模式。
// 对局页 GamePage：主对局界面，包含棋盘、比分、落子记录、先后手选择等
import React from 'react';
import { Link } from 'react-router-dom';
import Board from '../components/Board.jsx';
import Moves from '../components/Moves.jsx';
import FirstMoveSelector from '../components/FirstMoveSelector.jsx';
import ScoreBoard from '../components/ScoreBoard.jsx';
import { useGameLogic } from '../hooks/useGameLogic.jsx';
import { getGameData } from '../utils/storage.jsx';

export default function GamePage() {
  // 读取 localStorage 的 config 初始化 useGameLogic
  const localConfig = (getGameData() && getGameData().config) || { mode: 'pvp', boardSize: 3, pveFirst: 'human', pvpFirst: 'player1' };
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
    pveStats
  } = useGameLogic(localConfig);

  // 比分板数据
  // 只显示本局 currentScores
  const currentScores = (getGameData() && getGameData().currentScores) || { pvp: { player1: 0, player2: 0, draw: 0 }, pve: { human: 0, ai: 0, draw: 0 } };
  const pvpScore = { xWins: currentScores.pvp.player1, oWins: currentScores.pvp.player2, draws: currentScores.pvp.draw };
  const pveScore = { humanWins: currentScores.pve.human, aiWins: currentScores.pve.ai, draws: currentScores.pve.draw };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      background: '#f7f7f7',
      padding: '32px 0 0 0',
    }}>
      {/* 顶部主内容区：左-先后手选择，中-棋盘/比分/重开，右-落子记录 */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '32px',
        width: '100%',
        maxWidth: '1100px',
        marginBottom: '32px',
      }}>
        {/* 左侧：先后手选择 */}
        <div style={{ minWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FirstMoveSelector
            mode={mode}
            pveFirst={pveFirst}
            pvpFirst={pvpFirst}
            handlePveFirstChange={handlePveFirstChange}
            handlePvpFirstChange={handlePvpFirstChange}
          />
        </div>
        {/* 中间：棋盘、比分、rematch 按钮 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff8e1', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            boardSize={boardSize}
            calculateWinner={calculateWinner}
            isDraw={isDraw}
          />
          {/* 比分板 */}
          <ScoreBoard
            mode={mode}
            pvpScore={pvpScore}
            pveScore={pveScore}
          />
          {/* Rematch 按钮，仅对局结束时显示 */}
          {(calculateWinner(currentSquares, boardSize).winner || isDraw(currentSquares, boardSize)) && (
            <button className="rematch-button" style={{ marginTop: 24, width: 180 }} onClick={handleRematch}>Rematch</button>
          )}
        </div>
        {/* 右侧：落子记录 */}
        <div style={{ minWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Moves moves={moves} jumpTo={jumpTo} />
        </div>
      </div>
      {/* 底部按钮区：历史、新开局、返回首页 */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1.5rem',
        marginTop: 'auto',
        marginBottom: 32,
      }}>
        <Link to="/history" style={buttonStyle}>View History</Link>
        <Link to="/config" style={buttonStyle}>Start New Game</Link>
        <Link to="/" style={{ ...buttonStyle, background: '#eee', color: '#333' }}>Back to Home</Link>
      </div>
    </div>
  );
}

// 按钮样式
const buttonStyle = {
  display: 'block',
  minWidth: '180px',
  padding: '0.9rem 0',
  fontSize: '1.13rem',
  fontWeight: 600,
  color: '#fff',
  background: 'linear-gradient(90deg, #f7d56e 0%, #f7b36e 100%)',
  border: 'none',
  borderRadius: '8px',
  textAlign: 'center',
  textDecoration: 'none',
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  transition: 'background 0.2s, transform 0.1s',
  cursor: 'pointer',
};
