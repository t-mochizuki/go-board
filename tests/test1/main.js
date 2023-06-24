// A player can't place a white stone on [2, 2] of the board under the Go rule.
window.addEventListener("load", () => {
  [[1, 2], [2, 3], [2, 1], [3, 2]].forEach(([row, column]) => {
    const tile = document.querySelector(`table.board tr > td[data-row="${row}"][data-column="${column}"]`);
    tile.dataset.color = "BLACK"
  });

  // The following makes a problem easy.
  const stones = [];
  const boardSize = 5;
  for (let i = 0; i < boardSize; ++i) stones.push(Array(boardSize).fill(-1));
  for (let row = 0; row < boardSize; ++row) {
    for (let column = 0; column < boardSize; ++column) {
      const tile = document.querySelector(`table.board tr > td[data-row="${row}"][data-column="${column}"]`);

      if (tile.dataset.color === undefined) continue;

      if (tile.dataset.color === "BLACK") stones[row][column] = 0;
      if (tile.dataset.color === "WHITE") stones[row][column] = 1;
    }
  }

  // TODO: implement a checker

  let counter = 1;
  const color = () => counter % 2 === 1 ? "WHITE" : "BLACK";
  const inc = () => counter++;

  const kifu = [];

  const board = document.querySelector("table.board");
  board.addEventListener("click", () => {
    const tile = document.querySelector("table.board tr > td:hover");

    if (tile === null) return;

    if (tile.dataset.color !== undefined) return;

    tile.dataset.color = color();

    kifu.push({ row: tile.dataset.row, column: tile.dataset.column, color: tile.dataset.color });

    inc();
  });
});
