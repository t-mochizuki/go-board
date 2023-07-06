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

    isRemovable(stone, row, column) {
      if (row < 0 || this.boardSize <= row) return false;
      if (column < 0 || this.boardSize <= column) return false;

      if (-1 === this.stones[row][column]) return false;
      if (stone === this.stones[row][column]) return false;

      return true;
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

  class LinkCreator {
    constructor() {}

    run() {
      const linkElem = document.createElement("link");
      linkElem.setAttribute("href", "style.css");
      linkElem.setAttribute("rel", "stylesheet");
      return { linkElem };
    }
  }

  class TableCreator {
    constructor(boardSize) {
      this.boardSize = boardSize;
    }

    run() {
      const rows = [];

      const trFragment = new DocumentFragment();
      for (let row = 0; row < this.boardSize; ++row) {
        const tr = document.createElement("tr");
        tr.dataset.row = row;

        const columns = [];

        const tdFragment = new DocumentFragment();
        for (let column = 0; column < this.boardSize; ++column) {
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

      const tableElem = document.createElement("table");
      tableElem.className = "board";
      tableElem.append(tbody);

      return { tableElem, rows };
    }
  }

  class GoRule {
    constructor(boardSize) {
      this.boardSize = boardSize;
      this.stone = 0;
      this.kifu = [];
    }

    run(table, goBoard, turn) {
      const tile = table.querySelector("tr > td:hover");

      if (tile === null) return;

      if (tile.dataset.color !== undefined) return;

      const row = parseInt(tile.dataset.row);
      const column = parseInt(tile.dataset.column);

      [[-1, 0], [0, 1], [1, 0], [0, -1]].forEach(([dy, dx]) => {
        const board = new Board(this.boardSize);
        board.reset(goBoard);
        board.setStone(this.stone, row, column);

        if (board.isRemovable(this.stone, row + dy, column + dx)) {
          const checker = new Checker(this.boardSize);
          if (checker.isRemoval(board.stones, board.stones[row + dy][column + dx], row + dy, column + dx)) {
            checker.remove(goBoard, board.stones);
          }
        }
      });

      const board = new Board(this.boardSize);
      board.reset(goBoard);
      board.setStone(this.stone, row, column);

      const checker = new Checker(this.boardSize);
      if (checker.isRemoval(board.stones, this.stone, row, column)) {
        return;
      }

      const color = this.stone === 1 ? "WHITE" : "BLACK";
      tile.dataset.color = color;

      this.kifu.push({ row, column, color });

      this.stone = this.stone === 0 ? 1 : 0;
      if (turn !== null) {
        turn.textContent = this.stone === 1 ? "White's turn" : "Black's turn";
      }
    }
  }

  class GoBoard extends HTMLElement {
    constructor() {
      super();

      let shadow = this.dataset.test ? this : this.attachShadow({ mode: "open" });

      const turn = document.querySelector("p.turn");
      if (turn !== null) {
        turn.textContent = "Black's turn";
      }

      const boardSize = 9;
      const tableCreator = new TableCreator(boardSize);
      const { tableElem, rows: goBoard } = tableCreator.run();
      const goRule = new GoRule(boardSize);
      tableElem.addEventListener("click", () => goRule.run(tableElem, goBoard, turn));
      shadow.appendChild(tableElem);

      const linkCreator = new LinkCreator();
      const { linkElem } = linkCreator.run();
      shadow.appendChild(linkElem);
    }
  }

  customElements.define("go-board", GoBoard);
})();
