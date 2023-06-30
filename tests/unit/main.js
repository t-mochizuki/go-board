class Checker {
  constructor() {
    this.boardSize = 5;
  }

  isRemoval(stones, visited, color, row, column) {
    if (row < 0 || this.boardSize <= row) return true;
    if (column < 0 || this.boardSize <= column) return true;
    if (-1 === stones[row][column]) return false;
    if (color !== stones[row][column]) return true;

    if (visited[row][column]) return true;
    visited[row][column] = true;

    return [[-1, 0], [0, 1], [1, 0], [-1, 0]].map(([dy, dx]) => this.isRemoval(stones, visited, color, row + dy, column + dx)).every(x => x);
  }
}
