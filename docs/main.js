window.addEventListener("load", () => {
  // The following makes a problem easy.
  {
    const stones = [];
    const boardSize = 5;
    for (let i = 0; i < boardSize; ++i) stones.push(Array(boardSize).fill(-1));
    for (let row = 0; row < boardSize; ++row) {
      for (let column = 0; column < boardSize; ++column) {
        const tile = document.querySelector(`table.board tr[data-row="${row}"] > td[data-column="${column}"]`);

        if (tile.dataset.color === undefined) continue;

        if (tile.dataset.color === "BLACK") stones[row][column] = 0;
        if (tile.dataset.color === "WHITE") stones[row][column] = 1;
      }
    }
  }

  let counter = 0;
  const color = () => counter % 2 === 1 ? "WHITE" : "BLACK";
  const inc = () => counter++;

  const kifu = [];

  const board = document.querySelector("table.board");
  board.addEventListener("click", () => {
    const tile = document.querySelector("table.board tr > td:hover");

    if (tile === null) return;

    if (tile.dataset.color !== undefined) {
      // TODO: I want to remove the captured stones automatically.
      delete tile.dataset.color;
      return;
    }

    tile.dataset.color = color();

    kifu.push({ row: tile.dataset.row, column: tile.dataset.column, color: tile.dataset.color });

    inc();
  });
});
