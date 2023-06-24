window.addEventListener("load", () => {
  (() => {
    const kifu = [];
    const board = document.querySelector("table.board");
    let counter = 0;

    board.addEventListener("click", () => {
      const tile = document.querySelector("table.board tr > td:hover");

      if (tile === null) return;

      if (tile.dataset.color !== undefined) return;

      tile.dataset.color = counter % 2 === 1 ? "WHITE" : "BLACK";

      kifu.push({ row: tile.dataset.row, column: tile.dataset.column, color: counter % 2 === 1 ? 'WHITE' : 'BLACK' });

      counter++;
    });
  })();
});
