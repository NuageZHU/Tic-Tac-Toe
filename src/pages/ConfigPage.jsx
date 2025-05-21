// ConfigPage.jsx —— 配置页，负责设置新对局的棋盘大小和模式，并支持继续上次未完成的对局。
// 配置页 ConfigPage：负责新对局参数设置和继续旧对局
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SettingsPanel from '../components/SettingsPanel.jsx';
import { getGameData, setGameData, getDefaultGameData } from '../utils/storage.jsx';

export default function ConfigPage() {
  // 棋盘大小、模式、是否可继续旧对局
  const [boardSize, setBoardSize] = useState(3);
  const [mode, setMode] = useState('pvp');
  const [canContinue, setCanContinue] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 检查 localStorage 是否有可继续的对局
    const data = getGameData();
    const hasConfig = data && data.config && data.config.mode && data.config.boardSize;
    const hasMoves = data && Array.isArray(data.moves) && data.moves.length > 0;
    setCanContinue(!!(hasConfig && hasMoves));
  }, []);

  // 新开局：写入 config，重置 moves 和计分板，保留历史
  const handleStart = () => {
    // 只保存 mode 和 boardSize，先手交由 GamePage 控制
    // 新游戏时 moves 只重置为初始空棋盘，currentScores 也清零
    const data = getGameData() || getDefaultGameData();
    setGameData({
      ...data,
      config: { mode, boardSize },
      moves: [Array(boardSize * boardSize).fill(null)],
      currentScores: { pvp: { player1: 0, player2: 0, draw: 0 }, pve: { human: 0, ai: 0, draw: 0 } },
      // 保留历史 results/scores
      results: Array.isArray(data.results) ? data.results : getDefaultGameData().results,
      scores: data.scores && data.scores.pvp && data.scores.pve ? data.scores : getDefaultGameData().scores
    });
    navigate('/game');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f7f7f7',
    }}>
      {/* 配置标题 */}
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: 700,
        marginBottom: '2.2rem',
        color: '#333',
        letterSpacing: '1px',
        textAlign: 'center',
      }}>
        Game Configuration
      </h1>
      {/* 设置面板：棋盘大小、模式选择 */}
      <div style={{ marginBottom: '2.5rem', width: '280px' }}>
        <SettingsPanel
          boardSize={boardSize}
          mode={mode}
          handleBoardSizeChange={setBoardSize}
          handleModeChange={e => setMode(e.target.value)}
        />
        {/* 先手选择器已移除，只在 GamePage 控制 */}
      </div>
      {/* 按钮区：新开局、继续、返回首页 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        width: '220px',
      }}>
        <button onClick={handleStart} style={buttonStyle}>Start New Game</button>
        <Link
          to={canContinue ? "/game" : "#"}
          style={{
            ...buttonStyle,
            background: canContinue ? '#f7d56e' : '#eee',
            color: canContinue ? '#fff' : '#aaa',
            cursor: canContinue ? 'pointer' : 'not-allowed',
            pointerEvents: canContinue ? 'auto' : 'none',
          }}
        >
          Continue Old Game
        </Link>
        <Link to="/" style={{ ...buttonStyle, background: '#eee', color: '#333' }}>Back to Home</Link>
      </div>
    </div>
  );
}

// 按钮样式
const buttonStyle = {
  display: 'block',
  width: '100%',
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
