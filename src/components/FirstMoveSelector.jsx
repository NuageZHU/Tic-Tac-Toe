// 先手选择器 FirstMoveSelector：选择 PVP/PVE 下谁先手
import React from 'react';

const labelStyle = {
  fontSize: '1.05rem',
  color: '#444',
  marginBottom: '2px',
  fontWeight: 500,
};

const selectStyle = {
  fontSize: '1.08rem',
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1.5px solid #e0c97f',
  background: '#fff',
  color: '#333',
  outline: 'none',
  boxShadow: 'none',
  minWidth: '120px',
};

function FirstMoveSelector({ mode, pveFirst, pvpFirst, handlePveFirstChange, handlePvpFirstChange }) {
  if (mode === 'pvp') {
    // PVP 模式下选择 Player1/Player2 先手
    return (
      <div className="setting-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' }}>
        <label htmlFor="pvp-first" style={labelStyle}>First Move</label>
        <select id="pvp-first" className="setting-select" style={selectStyle} value={pvpFirst} onChange={handlePvpFirstChange}>
          <option value="player1">Player1 (X)</option>
          <option value="player2">Player2 (X)</option>
        </select>
      </div>
    );
  }
  if (mode === 'pve') {
    // PVE 模式下选择 Human/AI 先手
    return (
      <div className="setting-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' }}>
        <label htmlFor="pve-first" style={labelStyle}>First Move</label>
        <select id="pve-first" className="setting-select" style={selectStyle} value={pveFirst} onChange={handlePveFirstChange}>
          <option value="human">Human First ({pveFirst === 'human' ? 'X' : 'O'})</option>
          <option value="ai">AI First ({pveFirst === 'ai' ? 'X' : 'O'})</option>
        </select>
      </div>
    );
  }
  return null;
}

export default FirstMoveSelector;
