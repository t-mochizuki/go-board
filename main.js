window.addEventListener("load", () => {
  (() => {
    const board = document.querySelector(".board");
    let counter = 0;

    board.addEventListener("click", () => {
      const tile = document.querySelector(".board tr > td:hover");

      if (tile === null) return;

      tile.style.backgroundColor = counter % 2 === 0 ? "beige" : "darkkhaki";
      counter++;
    });
  })();
});
