{
  const stones = [];
  const boardSize = 5;
  for (let i = 0; i < boardSize; ++i) stones.push(Array(boardSize).fill(-1));

  // 1 0 _
  // 0 _ _
  // _ _ _
  stones[0][0] = 1;
  stones[1][0] = 0;
  stones[0][1] = 0;

  {
    const visited = [];
    for (let i = 0; i < boardSize; ++i) visited.push(Array(boardSize).fill(false));
    const checker = new Checker();
    console.assert(checker.isRemoval(stones, visited, stones[0][0], 0, 0), "The white stone should be removed.");
    console.table(visited);
  }
  {
    const visited = [];
    for (let i = 0; i < boardSize; ++i) visited.push(Array(boardSize).fill(false));
    const checker = new Checker();
    console.assert(checker.isRemoval(stones, visited, stones[1][0], 1, 0) === false, "The black stone shouldn't be removed.");
    console.table(visited);
  }
  {
    const visited = [];
    for (let i = 0; i < boardSize; ++i) visited.push(Array(boardSize).fill(false));
    const checker = new Checker();
    console.assert(checker.isRemoval(stones, visited, stones[0][1], 0, 1) === false, "The other black stone shouldn't be also not removed.");
    console.table(visited);
  }
}
