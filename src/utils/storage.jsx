// localStorage 工具：统一管理对局数据的读写、初始化、清空
const STORAGE_KEY = 'tic-tac-toe-data';

// 读取游戏数据
export function getGameData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// 写入游戏数据
export function setGameData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 清空游戏数据
export function clearGameData() {
  localStorage.removeItem(STORAGE_KEY);
}

// 默认数据结构
export function getDefaultGameData() {
  return {
    config: { mode: 'pvp', boardSize: 3 },
    moves: [],
    results: [],
    scores: {
      pvp: { player1: 0, player2: 0, draw: 0 },
      pve: { human: 0, ai: 0, draw: 0 }
    }
  };
}
