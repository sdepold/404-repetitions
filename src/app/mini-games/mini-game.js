import "./mini-game.less";
import { DOWN, UP, RIGHT, LEFT, keyPressed } from "../controls";
import {
  collides,
  containsHorizontally,
  rightOf,
} from "../helper/collision-detection";
import { destroyText } from "../helper/text";

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
      enemySpeed: 2,
      changeDifficulty: true,
    };
    this.enemies = [];
  }

  appendTo(container) {
    container.appendChild(this.container);
    this.hostContainer = container;
    this.container.classList.add("mini-game");

    window.blockMovement = true;

    return this;
  }

  initStateChange(property, delay) {
    this.state[property] = false;

    setTimeout(() => {
      this.state[property] = true;
    }, delay);
  }

  spawnEnemy() {
    const control = controls[~~(Math.random() * controls.length)];
    const enemy = {
      container: document.createElement("div"),
      control,
      position: {
        x: -50,
        y: this.targetContainer.offsetTop + 25,
      },
      highlight: false,
      speed: this.state.enemySpeed,
      destroyed: false,
    };

    enemy.container.innerHTML = controlsToCharMap[control];

    enemy.container.classList.add("enemy");
    this.container.appendChild(enemy.container);
    this.enemies.push(enemy);
  }

  removeEnemy(enemy) {
    enemy.container.parentNode.removeChild(enemy.container);
    this.enemies = this.enemies.filter((someEnemy) => enemy !== someEnemy);
  }

  updateEnemies() {
    [...this.enemies].forEach((enemy) => {
      if (rightOf(this.container, enemy.container)) {
        this.removeEnemy(enemy);
      }
    });

    this.enemies.forEach((enemy) => {
      if (enemy.destroyed) {
        enemy.contains = enemy.missed = enemy.collides = false;
        enemy.position.y -= 2;
      } else {
        enemy.position.x += enemy.speed;
        enemy.collides = collides(this.targetContainer, enemy.container);
        enemy.contains = containsHorizontally(
          this.targetContainer,
          enemy.container
        );
        enemy.missed = rightOf(this.targetContainer, enemy.container);
      }
    });
  }

  destroyEnemy(enemy) {
    enemy.destroyed = true;
    setTimeout(() => this.removeEnemy(enemy), 1000);
  }

  update() {
    if (!this.targetContainer) {
      this.targetContainer = document.createElement("div");
      this.targetContainer.classList.add("target");
      this.container.appendChild(this.targetContainer);
    }

    if (this.state.spawnTarget) {
      this.initStateChange("spawnTarget", this.state.spawnDelay);
      this.spawnEnemy();
    }

    if (this.state.changeDifficulty) {
      this.initStateChange("changeDifficulty", 2000);
      this.state.spawnDelay = Math.max(this.state.spawnDelay - 200, 400);
      this.state.enemySpeed = Math.min(this.state.enemySpeed + 0.1, 7);
    }

    this.updateEnemies();

    const targetedEnemy = this.enemies.find((enemy) => enemy.collides);

    if (targetedEnemy && keyPressed(targetedEnemy.control)) {
      this.destroyEnemy(targetedEnemy);
    }
  }

  render() {
    this.enemies.forEach((enemy) => {
      enemy.container.style.left = `${enemy.position.x}px`;
      enemy.container.style.top = `${enemy.position.y}px`;
      enemy.container.classList.toggle("collides", enemy.collides);
      enemy.container.classList.toggle("contains", enemy.contains);
      enemy.container.classList.toggle("missed", enemy.missed);
      enemy.container.classList.toggle("destroyed", enemy.destroyed);
    });
  }
}
