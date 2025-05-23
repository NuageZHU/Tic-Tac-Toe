// statUtils.jsx —— 统计工具，负责根据历史对局结果统计 PVP/PVE 的胜负场次、胜率等数据，供统计面板和数据持久化使用。
// 统计工具 statUtils：根据历史结果统计胜率和比分
export function computeStatsFromResults(gameResults) {
  const pvpStats = { total: 0, player1: 0, player2: 0, draw: 0 };
  const pveStats = { total: 0, human: 0, ai: 0, draw: 0 };
  gameResults.forEach(result => {
    if (result.startsWith('(PVP')) {
      pvpStats.total++;
      if (result.includes('Winner: Player1')) pvpStats.player1++;
      else if (result.includes('Winner: Player2')) pvpStats.player2++;
      else if (result.includes('Draw')) pvpStats.draw++;
    } else if (result.startsWith('(PVE')) {
      pveStats.total++;
      if (result.includes('Winner: Human')) pveStats.human++;
      else if (result.includes('Winner: AI')) pveStats.ai++;
      else if (result.includes('Draw')) pveStats.draw++;
    }
  });
  pvpStats.winRate1 = pvpStats.total ? (pvpStats.player1 / pvpStats.total * 100).toFixed(1) : '0.0';
  pvpStats.winRate2 = pvpStats.total ? (pvpStats.player2 / pvpStats.total * 100).toFixed(1) : '0.0';
  pveStats.winRateHuman = pveStats.total ? (pveStats.human / pveStats.total * 100).toFixed(1) : '0.0';
  pveStats.winRateAI = pveStats.total ? (pveStats.ai / pveStats.total * 100).toFixed(1) : '0.0';
  // 新增：返回原始分数对象，方便 useGameLogic 写入 localStorage
  return {
    pvp: { player1: pvpStats.player1, player2: pvpStats.player2, draw: pvpStats.draw },
    pve: { human: pveStats.human, ai: pveStats.ai, draw: pveStats.draw },
    pvpStats,
    pveStats
  };
}
