window.addEventListener("load", () => {
  (() => {
    const kifu = [];
    const board = document.querySelector(".board");
    let counter = 0;

    board.addEventListener("click", () => {
      const tile = document.querySelector(".board tr > td:hover");

      if (tile === null) return;

      kifu.push({ row: tile.dataset.row, column: tile.dataset.column, color: counter % 2 });

      tile.style.backgroundColor = counter % 2 === 0 ? "beige" : "darkkhaki";
      counter++;
    });
  })();
});
