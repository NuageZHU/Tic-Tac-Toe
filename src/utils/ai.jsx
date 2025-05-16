// 文件已重命名为 ai.jsx

export function getAIMove(squares, boardSize, aiMark) {
  const opponentMark = aiMark === 'X' ? 'O' : 'X';
  // 1. 检查AI是否能直接获胜
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      const test = squares.slice();
      test[i] = aiMark;
      if (calculateWinner(test, boardSize).winner === aiMark) {
        return i;
      }
    }
  }
  // 2. 检查是否需要阻挡对方获胜
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      const test = squares.slice();
      test[i] = opponentMark;
      if (calculateWinner(test, boardSize).winner === opponentMark) {
        return i;
      }
    }
  }
  // 3. 否则随机落子
  const empty = squares.map((v, i) => (v ? null : i)).filter((i) => i !== null);
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

// 需要外部传入 calculateWinner
function calculateWinner(squares, boardSize) {
  const lines = [];
  for (let row = 0; row < boardSize; row++) {
    lines.push(Array.from({ length: boardSize }, (_, col) => row * boardSize + col));
  }
  for (let col = 0; col < boardSize; col++) {
    lines.push(Array.from({ length: boardSize }, (_, row) => row * boardSize + col));
  }
  lines.push(Array.from({ length: boardSize }, (_, i) => i * (boardSize + 1)));
  lines.push(Array.from({ length: boardSize }, (_, i) => (i + 1) * (boardSize - 1)));
  for (const line of lines) {
    const [first, ...rest] = line;
    if (squares[first] && rest.every((index) => squares[index] === squares[first])) {
      return { winner: squares[first], winningSquares: line };
    }
  }
  return { winner: null, winningSquares: [] };
}
