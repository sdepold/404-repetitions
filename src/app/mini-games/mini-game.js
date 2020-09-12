import "./mini-game.less";
import { DOWN, UP, RIGHT, LEFT, keyPressed, SPACE } from "../controls";
import {
  collides,
  containsHorizontally,
  rightOf,
} from "../helper/collision-detection";
import { clearAndRenderTextToCanvas, renderLines } from "../helper/text";
import { destroyNode } from "../helper/node";
import { ultimateGoal } from "../story";

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
    this.p = player;
    this.originalPlayerPosition = { ...this.p.position };
    this.challengeName = challengeName;
    this.s = {
      started: false,
      spawnTarget: true,
      spawnDelay: 3000,
      enemySpeed: 2,
      changeDifficulty: true,
      score: 0,
      remainingTime: 40.4,
      completed: false,
      renderSpaceHint: true,
      completionTriggered: false,
    };
    this.enemies = [];
    this.scoreCanvas = document.createElement("canvas");
    this.startCanvas = document.createElement("canvas");
  }

  at(container) {
    container.appendChild(this.container);
    this.hostContainer = container;
    this.container.classList.add("mini-game");
    this.container.appendChild(this.scoreCanvas);
    this.scoreCanvas.classList.add("score");
    this.container.appendChild(this.startCanvas);
    this.startCanvas.classList.add("start-mini-game");

    setInterval(() => {
      this.s.renderSpaceHint = !this.s.renderSpaceHint;
    }, 750);

    return this;
  }

  initStateChange(property, delay) {
    this.s[property] = false;

    setTimeout(() => {
      this.s[property] = true;
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
      speed: this.s.enemySpeed,
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
    this.s.score += enemy.contains ? 4 : 1;
  }

  onComplete(fun) {
    this.onComplete = () => {
      if (this.s.completionTriggered) {
        return;
      }
      this.s.completionTriggered = true;

      setTimeout(() => {
        destroyNode(this.scoreCanvas);
        destroyNode(this.container);

        this.p.position = this.originalPlayerPosition;
        this.p.updateStat("rank", -this.s.score);

        window.blockMovement = false;

        setTimeout(async()=>{
        if(!this.p.hasCompletedCompetition) {
          this.p.hasCompletedCompetition = true;
          await ultimateGoal();
        }
      }, 1000);


        fun(this);
      }, 2000);
    };

    return this;
  }

  update() {
    window.blockMovement = true;

    if (!this.targetContainer) {
      this.targetContainer = document.createElement("div");
      this.targetContainer.classList.add("target");
      this.container.appendChild(this.targetContainer);
    }

    if (!this.s.started) {
      if (keyPressed(SPACE)) {
        this.s.started = true;
      } else {
        return;
      }
    }

    if (this.s.spawnTarget) {
      this.initStateChange("spawnTarget", this.s.spawnDelay);
      this.spawnEnemy();
    }

    if (this.s.changeDifficulty) {
      this.initStateChange("changeDifficulty", 2000);
      this.s.spawnDelay = Math.max(this.s.spawnDelay - 200, 500);
      this.s.enemySpeed = Math.min(this.s.enemySpeed + 0.1, 9);
    }

    if (this.s.remainingTime === 0) {
      this.enemies.forEach((e) => this.destroyEnemy(e));
      this.s.completed = true;
    }

    this.updateEnemies();

    const targetedEnemy = this.enemies.find((enemy) => enemy.collides);

    if (targetedEnemy && keyPressed(targetedEnemy.control)) {
      this.destroyEnemy(targetedEnemy);
      this.scoreEnemy(targetedEnemy);
    }

    if (!this.timeIntervalId) {
      this.timeIntervalId = setInterval(() => {
        if (this.s.remainingTime === 0) {
          return clearInterval(this.timeIntervalId);
        }
        this.s.remainingTime = ~~(this.s.remainingTime - 1);
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
      `Score: ${this.s.score}       Time: ${this.s.remainingTime}`,
      { color: "white", textAlign: "center" }
    );
    renderLines(this.startCanvas, [
      { text: this.challengeName, textSize: 24, x: 50 },
      {
        text:
          !this.s.started && this.s.renderSpaceHint
            ? "Press SPACE to start competition"
            : "",
        textAlign: "center",
        y: 50,
      },
    ]);
  }
}
