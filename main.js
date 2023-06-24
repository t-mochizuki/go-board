window.addEventListener("load", () => {
  (() => {
    const kifu = [];
    const occupied = [];
    for (let i = 0; i < 5; ++i) occupied.push(Array(5).fill(false));
    const board = document.querySelector(".board");
    let counter = 0;

    board.addEventListener("click", () => {
      const tile = document.querySelector(".board tr > td:hover");

      if (tile === null) return;

      if (occupied[parseInt(tile.dataset.row)][parseInt(tile.dataset.column)]) return;
      else occupied[parseInt(tile.dataset.row)][parseInt(tile.dataset.column)] = true;

      kifu.push({ row: tile.dataset.row, column: tile.dataset.column, color: counter % 2 === 1 ? 'WHITE' : 'BLACK' });

      tile.style.backgroundColor = counter % 2 === 1 ? "beige" : "darkkhaki";
      counter++;
    });
  })();
});
