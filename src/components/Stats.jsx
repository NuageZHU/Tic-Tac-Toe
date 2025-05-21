// Stats.jsx —— 统计面板组件，负责展示 PVP/PVE 的胜负场次、胜率统计，以及历史对局结果列表。
// 统计面板 Stats：展示 PVP/PVE 总结、胜率、历史结果
import React from 'react';

function Stats({ pvpStats, pveStats, gameResults }) {
  return (
    <>
      {/* 胜率统计表格 */}
      <div className="game-stats-summary">
        <h3 style={{ margin: '0 0 8px 0' }}>Win Rate Summary</h3>
        <table style={{ width: '100%', fontSize: '0.95rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7e7b7' }}>
              <th style={{ textAlign: 'left', padding: '2px 6px' }}>Mode</th>
              <th>Games</th>
              <th>Player1/Human</th>
              <th>Player2/AI</th>
              <th>Draw</th>
              <th>Win Rate1/Human</th>
              <th>Win Rate2/AI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PVP</td>
              <td>{pvpStats.total}</td>
              <td>{pvpStats.player1}</td>
              <td>{pvpStats.player2}</td>
              <td>{pvpStats.draw}</td>
              <td>{pvpStats.winRate1}%</td>
              <td>{pvpStats.winRate2}%</td>
            </tr>
            <tr>
              <td>PVE</td>
              <td>{pveStats.total}</td>
              <td>{pveStats.human}</td>
              <td>{pveStats.ai}</td>
              <td>{pveStats.draw}</td>
              <td>{pveStats.winRateHuman}%</td>
              <td>{pveStats.winRateAI}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* 历史对局结果列表 */}
      <div className="game-stats">
        <h3>Stats Tracking</h3>
        <ul>
          {gameResults.map((result, index) => (
            <li key={index}>Game {index + 1}: {result}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Stats;
