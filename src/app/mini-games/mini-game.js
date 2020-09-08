import "./mini-game.less";
import { DOWN, UP, RIGHT, LEFT } from "../controls";
import { collides, containsHorizontally, rightOf } from "../helper/collision-detection";

const controls = [LEFT, RIGHT, UP, DOWN];
const controlsToCharMap = {
  [LEFT]: "←",
  [RIGHT]: "→",
  [UP]: "↑",
  [DOWN]: "↓",
};

export default class MiniGame {
  constructor(player) {
    this.container = document.createElement("div");
    this.player = player;
    this.originalPlayerPosition = { ...player.position };
    this.state = {
      started: false,
      spawnTarget: true,
      spawnDelay: 3000,
    };
    this.enemies = [];
  }

  appendTo(container) {
    container.appendChild(this.container);
    this.hostContainer = container;
    this.container.classList.add("mini-game");

    return this;
  }

  initSpawnReset() {
    this.state.spawnTarget = false;

    setTimeout(() => {
      this.state.spawnTarget = true;
    }, this.state.spawnDelay);
  }

  spawnEnemy() {
    const control = controls[~~(Math.random() * controls.length)];
    const enemy = {
      container: document.createElement("div"),
      control,
      position: {
        x: -50,
      },
      highlight: false,
    };

    enemy.container.innerHTML = controlsToCharMap[control];

    enemy.container.classList.add("enemy");
    this.container.appendChild(enemy.container);
    this.enemies.push(enemy);
  }

  updateEnemies() {
    this.enemies.forEach((enemy) => {
      enemy.position.x += 2;

      if (this.targetContainer) {
        enemy.collides = collides(this.targetContainer, enemy.container);
        enemy.contains = containsHorizontally(this.targetContainer, enemy.container);
        enemy.missed = rightOf(this.targetContainer, enemy.container);
      }
    });
  }

  update() {
    if (this.state.spawnTarget) {
      this.initSpawnReset();
      this.spawnEnemy();
    }

    this.updateEnemies();
  }

  render() {
    if (!this.targetContainer) {
      this.targetContainer = document.createElement("div");
      this.targetContainer.classList.add("target");
      this.container.appendChild(this.targetContainer);
    }

    this.enemies.forEach((enemy) => {
      enemy.container.style.left = `${enemy.position.x}px`;
      enemy.container.classList.toggle("collides", enemy.collides);
      enemy.container.classList.toggle("contains", enemy.contains);
      enemy.container.classList.toggle("missed", enemy.missed);
    });
  }
}
