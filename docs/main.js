(() => {
  class Board {
    constructor(boardSize) {
      this.boardSize = boardSize;
      this.stones = [];
      for (let i = 0; i < this.boardSize; ++i) this.stones.push(Array(this.boardSize).fill(-1));
    }

    reset(goBoard) {
      for (let row = 0; row < this.boardSize; ++row) {
        for (let column = 0; column < this.boardSize; ++column) {
          const tile = goBoard[row][column];

          if (tile.dataset.color === undefined) continue;

          if (tile.dataset.color === "BLACK") this.stones[row][column] = 0;
          if (tile.dataset.color === "WHITE") this.stones[row][column] = 1;
        }
      }
    }

    setStone(stone, row, column) {
      this.stones[row][column] = stone;
    }

    remove(goBoard, stone, row, column) {
      if (row < 0 || this.boardSize <= row) return;
      if (column < 0 || this.boardSize <= column) return;

      if (-1 === this.stones[row][column]) return;
      if (stone === this.stones[row][column]) return;

      const checker = new Checker(this.boardSize);
      if (checker.isRemoval(this.stones, this.stones[row][column], row, column)) {
        checker.remove(goBoard, this.stones);
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

    isRemoval(stones, stone, row, column) {
      if (row < 0 || this.boardSize <= row) return true;
      if (column < 0 || this.boardSize <= column) return true;
      if (-1 === stones[row][column]) return false;
      if (stone !== stones[row][column]) return true;

      if (this.visited[row][column]) return true;
      this.path.push({ row, column });
      this.visited[row][column] = true;

      return [[-1, 0], [0, 1], [1, 0], [0, -1]].map(([dy, dx]) => this.isRemoval(stones, stone, row + dy, column + dx)).every(x => x);
    }

    remove(goBoard, stones) {
      for (const { row, column } of this.path) {
        const tile = goBoard[row][column];
        if (tile !== null) {
          delete tile.dataset.color;
        }
        stones[row][column] = -1;
      }
    }
  }

  class GoBoard extends HTMLElement {
    constructor() {
      super();

      let shadow = this.attachShadow({mode: 'open'});

      let style = document.createElement('style');
      style.textContent = `
      table.board {
        background-color: palegoldenrod;
        margin-left: auto;
        margin-right: auto;
      }

      table.board tr > td {
        background-color: palegoldenrod;
        border-radius: 50%;
        height: 80px;
        width: 80px;
      }

      table.board tr > td:hover {
        background-color: green;
        opacity: .15;
      }

      table.board tr > td[data-color="BLACK"] {
        background-color: darkkhaki;
      }

      table.board tr > td[data-color="BLACK"]:hover {
        background-color: magenta;
      }

      table.board tr > td[data-color="WHITE"] {
        background-color: beige;
      }

      table.board tr > td[data-color="WHITE"]:hover {
        background-color: magenta;
      }`;

      const boardSize = 9;

      const rows = [];

      const trFragment = new DocumentFragment();
      for (let row = 0; row < boardSize; ++row) {
        const tr = document.createElement("tr");
        tr.dataset.row = row;

        const columns = [];

        const tdFragment = new DocumentFragment();
        for (let column = 0; column < boardSize; ++column) {
          const td = document.createElement("td");
          td.dataset.row = row;
          td.dataset.column = column;

          tdFragment.append(td);

          columns.push(td);
        }

        tr.append(tdFragment);
        trFragment.append(tr);

        rows.push(columns);
      }

      const tbody = document.createElement("tbody");
      tbody.append(trFragment);

      const table = document.createElement("table");
      table.className = "board";
      table.append(tbody);

      let stone = 0;

      const kifu = [];

      const turn = document.querySelector("p.turn");
      if (turn !== null) {
        turn.textContent = stone === 1 ? "White's turn" : "Black's turn";
      }

      table.addEventListener("click", () => {
        const tile = shadow.querySelector("table.board tr > td:hover");

        if (tile === null) return;

        if (tile.dataset.color !== undefined) return;

        const row = parseInt(tile.dataset.row);
        const column = parseInt(tile.dataset.column);

        [[-1, 0], [0, 1], [1, 0], [0, -1]].forEach(([dy, dx]) => {
          const board = new Board(boardSize);
          board.reset(rows);
          board.setStone(stone, row, column);
          board.remove(rows, stone, row + dy, column + dx);
        });

        const board = new Board(boardSize);
        board.reset(rows);
        board.setStone(stone, row, column);

        const checker = new Checker(boardSize);
        if (checker.isRemoval(board.stones, stone, row, column)) {
          return;
        }

        const color = stone === 1 ? "WHITE" : "BLACK";
        tile.dataset.color = color;

        kifu.push({ row, column, color });

        stone = stone === 0 ? 1 : 0;
        if (turn !== null) {
          turn.textContent = stone === 1 ? "White's turn" : "Black's turn";
        }
      });

      shadow.appendChild(style);
      shadow.appendChild(table);
    }
  }

  customElements.define("go-board", GoBoard);
})();
