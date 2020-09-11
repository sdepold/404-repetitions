import "./player.less";

import { gettingDressedDialog, firstLevelUp, levelUp, competitionsUnlocked } from "./story";
import { keyPressed, LEFT, RIGHT, UP, DOWN } from "./controls";
import { plu } from "./audio";
export const changeableLevelStats = ["stamina", "strength" /*, "luck"*/];

export default class Player {
  constructor() {
    this.container = document.createElement("div");
    this.levelStats = {
      stamina: 1,
      strength: 1,
      luck: 1,
      requiredExperience: 100,
    };
    this.statsLimits = {
      stamina: this.levelStats.stamina * 100,
    };
    this.currentStats = {
      stamina: this.statsLimits.stamina,
      rank: 10000 + ~~(Math.random() * 10000),
      money: 4.04,
      experience: 0,
      level: 4,
      availableStatPoints: 0,
    };
    this.position = {
      x: 10,
      y: 40,
    };
    this.state = {
      dressed: false,
    };
  }

  updateLevelStat(property, delta) {
    this.levelStats[property] += delta;
    this.currentStats.availableStatPoints -= delta;
  }

  updateStat(property, delta) {
    if (property === "dressed") {
      gettingDressedDialog();
      return (this.state.dressed = delta);
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
      this.currentStats.availableStatPoints += this.currentStats.level;
      this.currentStats.level += 1;
      this.currentStats.experience -= this.levelStats.requiredExperience;
      this.levelStats.requiredExperience *= 2;

      setTimeout(() => {
        plu();

        switch(this.currentStats.level) {
          case 2: firstLevelUp(); break;
          case 4: competitionsUnlocked(); break;
          default: levelUp();
        }
      }, 50);
    }

    if (property === "stamina") {
      this.currentStats.stamina = Math.max(
        Math.min(this.currentStats.stamina, this.statsLimits.stamina),
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

    if (statName === "dressed") return this.state.dressed === value;

    return false;
  }

  appendTo(container) {
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
    if (
      keyPressed(UP) ||
      keyPressed(DOWN) ||
      keyPressed(LEFT) ||
      keyPressed(RIGHT)
    ) {
      this.container.classList.contains("walk") ||
        this.container.classList.add("walk");
    } else {
      this.container.classList.contains("walk") &&
        this.container.classList.remove("walk");
    }

    if (keyPressed(LEFT) && !this.container.classList.contains("inverse")) {
      this.container.classList.add("inverse");
    }
    if (keyPressed(RIGHT) && this.container.classList.contains("inverse")) {
      this.container.classList.remove("inverse");
    }
    this.container.classList.toggle("dressed", this.state.dressed);
  }
}
