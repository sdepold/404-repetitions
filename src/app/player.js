import "./player.less";

import {
  gettingDressedDialog,
  firstLevelUp,
  levelUp,
  competitionsUnlocked,
} from "./story";
import { keyPressed, LEFT, RIGHT, UP, DOWN } from "./controls";
import { playLevelUp } from "./audio";
export const changeableLevelStats = ["stamina", "strength"];

export default class Player {
  constructor() {
    this.container = document.createElement("div");
    this.levelStats = {
      stamina: 1,
      strength: 1,
      requiredExperience: 100,
    };
    this.currentStats = {
      stamina: this.maxStamina,
      rank: 4040,
      money: 4.04,
      experience: 0,
      level: 1,
      points: 0,
    };
    this.position = {
      x: 10,
      y: 40,
    };
    this.s = {
      dressed: false,
    };
  }

  get maxStamina() {
    return this.levelStats.stamina * 100;
  }

  updateLevelStat(property, delta) {
    this.levelStats[property] += delta;
    this.currentStats.points -= delta;
  }

  updateStat(property, delta) {
    if (property === "dressed") {
      gettingDressedDialog();
      return (this.s.dressed = delta);
    }

    if (property.includes(".")) {
      const [statScope, propertyName] = property.split(".");
      this[statScope][propertyName] += delta;
      return;
    }

    this.currentStats[property] += delta;

    while (
      property === "experience" &&
      this.currentStats.experience >= this.levelStats.requiredExperience
    ) {
      this.currentStats.points += 1;
      this.currentStats.level += 1;
      this.currentStats.experience -= this.levelStats.requiredExperience;
      this.levelStats.requiredExperience *= 2;

      setTimeout(() => {
        playLevelUp();

        switch (this.currentStats.level) {
          case 2:
            firstLevelUp();
            break;
          case 4:
            competitionsUnlocked();
            break;
          default:
            levelUp();
        }
      }, 50);
    }

    if (property === "stamina") {
      this.currentStats.stamina = Math.max(
        Math.min(this.currentStats.stamina, this.maxStamina),
        0
      );
    }
  }

  hasStat(statName, value) {
    if (statName === "time") return true;

    if (Object.keys(this.currentStats).includes(statName)) {
      return this.currentStats[statName] >= value;
    }

    if (Object.keys(this.levelStats).includes(statName)) {
      return this.levelStats[statName] >= value;
    }

    if (statName === "dressed") return this.s.dressed === value;

    return false;
  }

  at(container) {
    container.appendChild(this.container);
    this.container.classList.add("player");

    return this;
  }

  update() {
    if (!window.blockMovement) {
      if (keyPressed(LEFT)) {
        this.position.x -= 5;
      } else if (keyPressed(RIGHT)) {
        this.position.x += 5;
      }

      if (keyPressed(UP)) {
        this.position.y -= 5;
      } else if (keyPressed(DOWN)) {
        this.position.y += 5;
      }
    }

    this.container.style.left = `${this.position.x}px`;
    this.container.style.top = `${this.position.y}px`;
  }

  render() {
    this.container.classList.toggle(
      "walk",
      keyPressed(UP) ||
        keyPressed(DOWN) ||
        keyPressed(LEFT) ||
        keyPressed(RIGHT)
    );

    if (keyPressed(LEFT) && !this.container.classList.contains("inverse")) {
      this.container.classList.add("inverse");
    }
    if (keyPressed(RIGHT) && this.container.classList.contains("inverse")) {
      this.container.classList.remove("inverse");
    }
    this.container.classList.toggle("dressed", this.s.dressed);
  }
}
