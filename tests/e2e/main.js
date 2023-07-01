(() => {
  class Board {
    constructor(boardSize) {
      this.boardSize = boardSize;
      this.stones = [];
      for (let i = 0; i < this.boardSize; ++i) this.stones.push(Array(this.boardSize).fill(-1));
    }

    setStones() {
      for (let row = 0; row < this.boardSize; ++row) {
        for (let column = 0; column < this.boardSize; ++column) {
          const tile = document.querySelector(`table.board tr[data-row="${row}"] > td[data-column="${column}"]`);

          if (tile.dataset.color === undefined) continue;

          if (tile.dataset.color === "BLACK") this.stones[row][column] = 0;
          if (tile.dataset.color === "WHITE") this.stones[row][column] = 1;
        }
      }
    }

    setStone(color, row, column) {
      this.stones[row][column] = color;
    }
  }

  class Checker {
    constructor(boardSize) {
      this.boardSize = boardSize;
      this.path = [];
      this.visited = [];
      for (let i = 0; i < this.boardSize; ++i) this.visited.push(Array(this.boardSize).fill(false));
    }

    isRemoval(stones, color, row, column) {
      if (row < 0 || this.boardSize <= row) return true;
      if (column < 0 || this.boardSize <= column) return true;
      if (-1 === stones[row][column]) return false;
      if (color !== stones[row][column]) return true;

      if (this.visited[row][column]) return true;
      this.path.push({ row: row, column: column });
      this.visited[row][column] = true;

      return [[-1, 0], [0, 1], [1, 0], [0, -1]].map(([dy, dx]) => this.isRemoval(stones, color, row + dy, column + dx)).every(x => x);
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
  }

  window.addEventListener("load", () => {
    const boardSize = 5;

    let counter = 1;
    const color = () => counter % 2 === 1 ? "WHITE" : "BLACK";
    const inc = () => counter++;

    const kifu = [];

    const board = document.querySelector("table.board");
    board.addEventListener("click", () => {
      const tile = document.querySelector("table.board tr > td:hover");

      if (tile === null) return;

      if (tile.dataset.color !== undefined) return;

      const b = new Board(boardSize);
      b.setStones();
      const row = parseInt(tile.dataset.row);
      const column = parseInt(tile.dataset.column);
      b.setStone(counter % 2, row, column);
      const checker = new Checker(boardSize);
      if (checker.isRemoval(b.stones, counter % 2, row, column)) {
        return;
      }

      tile.dataset.color = color();

      kifu.push({ row: tile.dataset.row, column: tile.dataset.column, color: tile.dataset.color });

      inc();
    });
  });
})();
