import React from 'react';

function SettingsPanel({
  boardSize,
  mode,
  pveFirst,
  pvpFirst,
  handleBoardSizeChange,
  handleModeChange,
  handlePveFirstChange,
  handlePvpFirstChange
}) {
  return (
    <div className="game-settings">
      <div className="setting-group">
        <label htmlFor="board-size">Select Board Size: </label>
        <select
          id="board-size"
          className="setting-select"
          value={boardSize}
          onChange={(e) => handleBoardSizeChange(Number(e.target.value))}
        >
          <option value={3}>3x3</option>
          <option value={4}>4x4</option>
          <option value={5}>5x5</option>
          <option value={6}>6x6</option>
          <option value={7}>7x7</option>
          <option value={8}>8x8</option>
        </select>
      </div>
      <div className="setting-group">
        <label htmlFor="mode">Mode: </label>
        <select id="mode" className="setting-select" value={mode} onChange={handleModeChange}>
          <option value="pvp">PVP (Player vs Player)</option>
          <option value="pve">PVE (Player vs AI)</option>
        </select>
      </div>
      {mode === 'pvp' && (
        <div className="setting-group">
          <label htmlFor="pvp-first">First Move: </label>
          <select id="pvp-first" className="setting-select" value={pvpFirst} onChange={handlePvpFirstChange}>
            <option value="player1">Player1 (X)</option>
            <option value="player2">Player2 (X)</option>
          </select>
        </div>
      )}
      {mode === 'pve' && (
        <div className="setting-group">
          <label htmlFor="pve-first">First Move: </label>
          <select id="pve-first" className="setting-select" value={pveFirst} onChange={handlePveFirstChange}>
            <option value="human">Human First ({pveFirst === 'human' ? 'X' : 'O'})</option>
            <option value="ai">AI First ({pveFirst === 'ai' ? 'X' : 'O'})</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default SettingsPanel;
