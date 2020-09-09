import "./mini-game.less";
import { DOWN, UP, RIGHT, LEFT, keyPressed, SPACE } from "../controls";
import {
  collides,
  containsHorizontally,
  rightOf,
} from "../helper/collision-detection";
import { clearAndRenderTextToCanvas, renderLines } from "../helper/text";
import { destroyNode } from "../helper/node";

const controls = [LEFT, RIGHT, UP, DOWN];
const controlsToCharMap = {
  [LEFT]: "←",
  [RIGHT]: "→",
  [UP]: "↑",
  [DOWN]: "↓",
};

export default class MiniGame {
  constructor(player, challengeName) {
    this.container = document.createElement("div");
    this.player = player;
    this.originalPlayerPosition = { ...player.position };
    this.challengeName = challengeName;
    this.state = {
      started: false,
      spawnTarget: true,
      spawnDelay: 3000,
      enemySpeed: 2,
      changeDifficulty: true,
      score: 0,
      remainingTime: 40.4,
      completed: false,
      renderSpaceHint: true,
    };
    this.enemies = [];
    this.scoreCanvas = document.createElement("canvas");
    this.startCanvas = document.createElement("canvas");
  }

  appendTo(container) {
    container.appendChild(this.container);
    this.hostContainer = container;
    this.container.classList.add("mini-game");
    this.container.appendChild(this.scoreCanvas);
    this.scoreCanvas.classList.add("score");
    this.container.appendChild(this.startCanvas);
    this.startCanvas.classList.add("start-mini-game");

    window.blockMovement = true;

    setInterval(() => {
      this.state.renderSpaceHint = !this.state.renderSpaceHint;
    }, 750);

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
    destroyNode(enemy.container);
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

  scoreEnemy(enemy) {
    this.state.score += enemy.contains ? 2 : 1;
  }

  onComplete(fun) {
    this.onComplete = () => {
      setTimeout(() => {
        destroyNode(this.scoreCanvas);
        destroyNode(this.container);
        this.player.position = this.originalPlayerPosition;
        this.player.updateStat("rank", -this.state.score);
        window.blockMovement = false;

        fun(this);
      }, 2000);
    };
    return this;
  }

  update() {
    if (!this.targetContainer) {
      this.targetContainer = document.createElement("div");
      this.targetContainer.classList.add("target");
      this.container.appendChild(this.targetContainer);
    }

    if (!this.state.started) {
      if (keyPressed(SPACE)) {
        this.state.started = true;
      } else {
        return;
      }
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

    if (this.state.remainingTime === 0) {
      this.enemies.forEach((e) => this.destroyEnemy(e));
      this.state.completed = true;
    }

    this.updateEnemies();

    const targetedEnemy = this.enemies.find((enemy) => enemy.collides);

    if (targetedEnemy && keyPressed(targetedEnemy.control)) {
      this.destroyEnemy(targetedEnemy);
      this.scoreEnemy(targetedEnemy);
    }

    if (!this.timeIntervalId) {
      this.timeIntervalId = setInterval(() => {
        if (this.state.remainingTime === 0) {
          return clearInterval(this.timeIntervalId);
        }
        this.state.remainingTime = ~~(this.state.remainingTime - 1);
      }, 1000);
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

    this.startCanvas.width = this.scoreCanvas.width = this.hostContainer.clientWidth;
    clearAndRenderTextToCanvas(
      this.scoreCanvas,
      `Score: ${this.state.score}       Time: ${this.state.remainingTime}`.toUpperCase(),
      { color: "white", textAlign: "center" }
    );
    renderLines(this.startCanvas, [
      { text: this.challengeName, textSize: 24, x: 50 },
      {
        text:
          !this.state.started && this.state.renderSpaceHint
            ? "Press SPACE to start competition"
            : "",
        textAlign: "center",
        y: 50,
      },
    ]);
  }
}
