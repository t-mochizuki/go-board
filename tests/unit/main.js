class Checker {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.path = [];
    this.visited = [];
    for (let i = 0; i < this.boardSize; ++i) this.visited.push(Array(this.boardSize).fill(false));
    this.stones = [];
    for (let i = 0; i < this.boardSize; ++i) this.stones.push(Array(this.boardSize).fill(-1));
  }

  isRemoval(stones, color, row, column) {
    if (row < 0 || this.boardSize <= row) return true;
    if (column < 0 || this.boardSize <= column) return true;
    if (-1 === stones[row][column]) return false;
    if (color !== stones[row][column]) return true;

    if (this.visited[row][column]) return true;
    this.path.push({ row: row, column: column });
    this.visited[row][column] = true;

    return [[-1, 0], [0, 1], [1, 0], [-1, 0]].map(([dy, dx]) => this.isRemoval(stones, color, row + dy, column + dx)).every(x => x);
  }

  remove(stones) {
    for (const { row, column } of this.path) {
      const tile = document.querySelector(`table.board tr[data-row="${row}"] > td[data-column="${column}"]`);
      if (tile !== null) {
        delete tile.dataset.color;
      }
      stones[row][column] = -1;
    }
  }

  prepare() {
    for (let row = 0; row < this.boardSize; ++row) {
      for (let column = 0; column < this.boardSize; ++column) {
        const tile = document.querySelector(`table.board tr[data-row="${row}"] > td[data-column="${column}"]`);

        if (tile.dataset.color === undefined) continue;

        if (tile.dataset.color === "BLACK") this.stones[row][column] = 0;
        if (tile.dataset.color === "WHITE") this.stones[row][column] = 1;
      }
    }
  }
}
