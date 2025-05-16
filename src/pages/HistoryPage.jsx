// 历史页 HistoryPage：展示历史战绩、比分统计、清空历史、继续对局
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Stats from '../components/Stats.jsx';
import { getGameData, setGameData, getDefaultGameData } from '../utils/storage.jsx';

export default function HistoryPage() {
  // 历史对局结果、比分、是否可继续
  const [results, setResults] = useState([]);
  const [scores, setScores] = useState({ pvp: { player1: 0, player2: 0, draw: 0 }, pve: { human: 0, ai: 0, draw: 0 } });
  const [canContinue, setCanContinue] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 读取历史数据
    const data = getGameData();
    setResults((data && data.results) || []);
    setScores((data && data.scores) || { pvp: { player1: 0, player2: 0, draw: 0 }, pve: { human: 0, ai: 0, draw: 0 } });
  }, []);

  useEffect(() => {
    // 检查是否有可继续的对局
    const data = getGameData();
    const hasConfig = data && data.config && data.config.mode && data.config.boardSize;
    const hasMoves = data && Array.isArray(data.moves) && data.moves.length > 0;
    setCanContinue(!!(hasConfig && hasMoves));
  }, []);

  // 清除历史记录和所有对局数据
  const handleClearHistory = () => {
    const cleared = getDefaultGameData();
    setGameData({ ...cleared, currentScores: cleared.scores });
    setResults([]);
    setScores(cleared.scores);
    navigate('/'); // 跳转到首页
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7f7f7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 0 0 0',
    }}>
      {/* 标题 */}
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: 700,
        marginBottom: '2.2rem',
        color: '#333',
        letterSpacing: '1px',
        textAlign: 'center',
      }}>
        Game History
      </h1>
      {/* 历史统计区 */}
      <div style={{
        width: '100%',
        maxWidth: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '32px',
      }}>
        <div style={{ width: '100%', background: '#fff8e1', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: 24 }}>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#b97a1a', fontSize: '1.2rem', padding: '32px 0' }}>No history available</div>
          ) : (
            <Stats pvpStats={{
              total: scores.pvp.player1 + scores.pvp.player2 + scores.pvp.draw,
              player1: scores.pvp.player1,
              player2: scores.pvp.player2,
              draw: scores.pvp.draw,
              winRate1: scores.pvp.player1 + scores.pvp.player2 + scores.pvp.draw > 0 ? (scores.pvp.player1 / (scores.pvp.player1 + scores.pvp.player2 + scores.pvp.draw) * 100).toFixed(1) : '0.0',
              winRate2: scores.pvp.player1 + scores.pvp.player2 + scores.pvp.draw > 0 ? (scores.pvp.player2 / (scores.pvp.player1 + scores.pvp.player2 + scores.pvp.draw) * 100).toFixed(1) : '0.0',
            }}
            pveStats={{
              total: scores.pve.human + scores.pve.ai + scores.pve.draw,
              human: scores.pve.human,
              ai: scores.pve.ai,
              draw: scores.pve.draw,
              winRateHuman: scores.pve.human + scores.pve.ai + scores.pve.draw > 0 ? (scores.pve.human / (scores.pve.human + scores.pve.ai + scores.pve.draw) * 100).toFixed(1) : '0.0',
              winRateAI: scores.pve.human + scores.pve.ai + scores.pve.draw > 0 ? (scores.pve.ai / (scores.pve.human + scores.pve.ai + scores.pve.draw) * 100).toFixed(1) : '0.0',
            }}
            gameResults={results} />
          )}
        </div>
      </div>
      {/* 底部按钮区：清空历史、继续、返回首页 */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1.5rem',
        marginTop: 'auto',
        marginBottom: 32,
        justifyContent: 'center',
      }}>
        <button onClick={handleClearHistory} style={{ ...buttonStyle, background: '#e57373', color: '#fff' }}>Clear History</button>
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
