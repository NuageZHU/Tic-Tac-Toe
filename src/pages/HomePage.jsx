// HomePage.jsx —— 首页，作为主入口，负责新开局、继续对局和查看历史的导航。
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGameData } from '../utils/storage.jsx';

export default function HomePage() {
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    // 检查 localStorage 是否有可继续的对局数据
    const data = getGameData();
    // 判断有无正在进行的对局：
    // 1. 有 config（mode/boardSize）
    // 2. 有 moves 且 moves 至少有一步不是全 null（即有人下过棋，或新开局未下棋但 moves 不为空）
    // 3. 或 currentScores 有分数（即本局有计分）
    // 只要 moves 不为 undefined/null 且为数组即可继续
    const hasConfig = data && data.config && data.config.mode && data.config.boardSize;
    const hasMoves = data && Array.isArray(data.moves) && data.moves.length > 0;
    // 检查 moves 是否全为 null（即新开局未下棋）
    let hasNonEmptyMove = false;
    if (hasMoves) {
      for (const squares of data.moves) {
        if (Array.isArray(squares) && squares.some(cell => cell !== null)) {
          hasNonEmptyMove = true;
          break;
        }
      }
    }
    // 只要有 config 且 moves 不为空（即使全为 null，也允许继续）
    setCanContinue(!!(hasConfig && hasMoves));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f7f7f7',
    }}>
      {/* 标题 */}
      <h1 style={{
        fontSize: '2.8rem',
        fontWeight: 700,
        marginBottom: '2.5rem',
        color: '#333',
        letterSpacing: '2px',
        textAlign: 'center',
      }}>
        Tic Tac Toe
      </h1>
      {/* 主页按钮区：新开局、继续、历史 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '220px',
      }}>
        <Link to="/config" style={buttonStyle}>New Game</Link>
        <Link
          to={canContinue ? "/game" : "#"}
          style={{
            ...buttonStyle,
            background: canContinue ? 'linear-gradient(90deg, #f7d56e 0%, #f7b36e 100%)' : '#eee',
            color: canContinue ? '#fff' : '#aaa',
            cursor: canContinue ? 'pointer' : 'not-allowed',
            pointerEvents: canContinue ? 'auto' : 'none',
          }}
        >
          Continue Game
        </Link>
        <Link to="/history" style={buttonStyle}>View History</Link>
      </div>
    </div>
  );
}

// 按钮样式
const buttonStyle = {
  display: 'block',
  width: '100%',
  padding: '0.9rem 0',
  fontSize: '1.15rem',
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
