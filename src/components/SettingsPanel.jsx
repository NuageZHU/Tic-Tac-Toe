// 设置面板 SettingsPanel：选择棋盘大小和对局模式
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

function SettingsPanel({
  boardSize,
  mode,
  handleBoardSizeChange,
  handleModeChange
}) {
  return (
    <div className="game-settings" style={{
      flex: 1,
      minWidth: '180px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '24px',
      backgroundColor: '#fff8e1',
      borderRadius: '8px',
      padding: '24px 12px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    }}>
      {/* 棋盘大小选择 */}
      <div className="setting-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' }}>
        <label htmlFor="board-size" style={labelStyle}>Board Size</label>
        <select
          id="board-size"
          className="setting-select"
          style={selectStyle}
          value={boardSize}
          onChange={(e) => handleBoardSizeChange(Number(e.target.value))}
        >
          {[3,4,5,6,7,8].map(size => (
            <option key={size} value={size}>{size} x {size}</option>
          ))}
        </select>
      </div>
      {/* 对局模式选择 */}
      <div className="setting-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' }}>
        <label htmlFor="mode" style={labelStyle}>Game Mode</label>
        <select id="mode" className="setting-select" style={selectStyle} value={mode} onChange={handleModeChange}>
          <option value="pvp">PVP（Player vs Player）</option>
          <option value="pve">PVE（Player vs AI）</option>
        </select>
      </div>
      {/* ConfigPage 不再渲染 FirstMoveSelector */}
    </div>
  );
}

export default SettingsPanel;
