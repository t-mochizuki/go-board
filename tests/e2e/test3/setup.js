(() => {
  [[0, 0],
   [-1, 0], [0, 1], [0, -1],
   ...[[1, 0], [0, 1], [0, -1]].map(([dy, dx]) => [dy + 1, dx])
  ].forEach(([dy, dx]) => {
    const row = dy + 2;
    const column = dx + 2;
    const tile = document.querySelector(`table.board tr[data-row="${row}"] > td[data-column="${column}"]`);
    if (tile !== null) {
      if (row === 2 && column == 2) {
        tile.dataset.color = "BLACK";
      } else {
        tile.dataset.color = "WHITE";
      }
    }
  });
})();
