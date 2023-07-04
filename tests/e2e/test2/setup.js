(() => {
  [[-1, 0], [0, 1], [1, 0], [0, -1]].forEach(([dy, dx]) => {
    const row = dy + 2;
    const column = dx + 2;
    const tile = document.querySelector(`table.board tr[data-row="${row}"] > td[data-column="${column}"]`);
    if (tile !== null) {
      tile.dataset.color = "BLACK";
    }
  });

  [[0, 1], [1, 0], [0, -1]].forEach(([dy, dx]) => {
    const row = dy + 3;
    const column = dx + 2;
    const tile = document.querySelector(`table.board tr[data-row="${row}"] > td[data-column="${column}"]`);
    if (tile !== null) {
      tile.dataset.color = "WHITE";
    }
  });
})();
