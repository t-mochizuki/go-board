window.addEventListener("load", () => {
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

  const checker = new Checker(boardSize);
  console.assert(checker.isRemoval(stones, stones[2][2], 2, 2), "The black stones should be removed.");
  checker.remove(stones);
});
