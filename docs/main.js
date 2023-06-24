window.addEventListener("load", () => {
  let counter = 0;
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
