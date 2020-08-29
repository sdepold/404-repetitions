import "./ground.less";

const originalTileWidth = 30;
const originalTileHeight = 15;
const tileMultiplier = 3;
const tileWidth = originalTileWidth * tileMultiplier;
const tileHeight = originalTileHeight * tileMultiplier;

export default class Ground {
  constructor() {
    this.container = document.createElement("div");
    this.generateTiles();
  }

  generateTiles() {
    this.container.classList.add("ground");

    let x = 0;
    let y = 0;

    for (let x = 0; x < window.innerWidth / tileWidth + 1; x++) {
      for (let y = 0; y < window.innerHeight / tileHeight + 1; y++) {
        const tile = document.createElement("div");
        tile.classList.add("tile", "grass");
        tile.style.left = `${x * tileWidth}px`;
        tile.style.top = `${y * tileHeight}px`;

        const cloneTile = tile.cloneNode();
        cloneTile.style.left = `${x * tileWidth + 0.5 * tileWidth}px`;
        cloneTile.style.top = `${y * tileHeight + 0.5 * tileHeight}px`;

        if (Math.random() < 0.05) {
          tile.classList.remove("grass");
        }

        this.container.appendChild(tile);
        this.container.appendChild(cloneTile);
      }
    }
  }

  appendTo(container) {
    container.appendChild(this.container);

    return this;
  }

  update() {}

  render() {}
}
