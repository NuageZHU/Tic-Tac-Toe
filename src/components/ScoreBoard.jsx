// 比分板 ScoreBoard：根据模式显示当前比分（PVP/PVE）
import React from 'react';

export default function ScoreBoard({ mode, pvpScore, pveScore }) {
  let content;
  if (mode === 'pvp') {
    // PVP 模式下仅显示 Player1/Player2/Draw
    content = (
      <div style={scoreRowStyle}>
        <span>Player1：{pvpScore.xWins}</span>
        <span>Player2：{pvpScore.oWins}</span>
        <span>Draw：{pvpScore.draws}</span>
      </div>
    );
  } else if (mode === 'pve') {
    // PVE 模式下显示 Human/AI/Draw
    content = (
      <div style={scoreRowStyle}>
        <span>Human：{pveScore.humanWins}</span>
        <span>AI：{pveScore.aiWins}</span>
        <span>Draw：{pveScore.draws}</span>
      </div>
    );
  } else {
    content = null;
  }
  return (
    <div style={{
      background: '#fff0d6',
      borderRadius: '12px',
      border: '1.5px solid #e0c97f',
      padding: '16px 32px',
      margin: '18px 0 0 0',
      fontSize: '1.18rem',
      fontWeight: 600,
      color: '#b97a1a',
      textAlign: 'center',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      minWidth: '260px',
      letterSpacing: '1px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
    }}>
      {content}
    </div>
  );
}

// 行内比分样式
const scoreRowStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: '32px',
  justifyContent: 'center',
  alignItems: 'center',
};
