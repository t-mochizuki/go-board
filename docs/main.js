(() => {
  class Board {
    constructor(boardSize) {
      this.boardSize = boardSize;
      this.stones = [];
      for (let i = 0; i < this.boardSize; ++i) this.stones.push(Array(this.boardSize).fill(-1));
    }

    reset() {
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

    remove(color, row, column) {
      if (row < 0 || this.boardSize <= row) return;
      if (column < 0 || this.boardSize <= column) return;

      if (-1 === this.stones[row][column]) return;
      if (color === this.stones[row][column]) return;

      const checker = new Checker(this.boardSize);
      if (checker.isRemoval(this.stones, this.stones[row][column], row, column)) {
        checker.remove(this.stones);
      }
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
      this.path.push({ row, column });
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

    let counter = 0;

    const kifu = [];

    const turn = document.querySelector("p.turn");

    document.querySelector("table.board").addEventListener("click", () => {
      const tile = document.querySelector("table.board tr > td:hover");

      if (tile === null) return;

      if (tile.dataset.color !== undefined) return;

      const row = parseInt(tile.dataset.row);
      const column = parseInt(tile.dataset.column);

      [[-1, 0], [0, 1], [1, 0], [0, -1]].forEach(([dy, dx]) => {
        const board = new Board(boardSize);
        board.reset();
        board.setStone(counter % 2, row, column);
        board.remove(counter % 2, row + dy, column + dx);
      });

      const board = new Board(boardSize);
      board.reset();
      board.setStone(counter % 2, row, column);

      const checker = new Checker(boardSize);
      if (checker.isRemoval(board.stones, counter % 2, row, column)) {
        return;
      }

      const color = counter === 1 ? "WHITE" : "BLACK";
      tile.dataset.color = color;

      kifu.push({ row, column, color });

      counter = counter === 0 ? 1 : 0;
      if (turn !== null) {
        turn.textContent = counter === 1 ? "White's turn" : "Black's turn";
      }
    });
  });
})();
