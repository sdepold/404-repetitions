import "./player.less";

import background from "../char.png";
export const changeableLevelStats = ["stamina", "strength", "luck"];

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
      level: 1,
      availableStatPoints: 0,
    };
    this.position = {
      x: 0,
      y: 0,
    };
    this.keyPressed = {
      up: false,
      left: false,
      top: false,
      right: false,
      space: false,
    };
    this.observeKeyboard();
  }

  observeKeyboard() {
    const setKeyPressed = (prop, value) => (this.keyPressed[prop] = value);
    const evalKeyPress = (e, value) => {
      e.preventDefault();

      if ([38, 87].includes(e.which)) {
        setKeyPressed("up", value);
      }

      if ([40, 83].includes(e.which)) {
        setKeyPressed("down", value);
      }

      if ([37, 65].includes(e.which)) {
        setKeyPressed("left", value);
      }

      if ([39, 68].includes(e.which)) {
        setKeyPressed("right", value);
      }

      if (e.which === 32) {
        setKeyPressed("space", value);
      }
    };

    window.onkeydown = window.onkeypress = (e) => evalKeyPress(e, true);
    window.onkeyup = (e) => evalKeyPress(e, false);
  }

  updateLevelStat(property, delta) {
    this.levelStats[property] += delta;
    this.currentStats.availableStatPoints -= delta;
  }

  updateStat(property, delta) {
    this.currentStats[property] += delta;

    while (
      property === "experience" &&
      this.currentStats.experience >= this.levelStats.requiredExperience
    ) {
      this.currentStats.availableStatPoints += this.currentStats.level;
      this.currentStats.level += 1;
      this.currentStats.experience -= this.levelStats.requiredExperience;
      this.levelStats.requiredExperience *= 2;
    }

    if (property === "stamina") {
      this.currentStats.stamina = Math.min(
        this.currentStats.stamina,
        this.statsLimits.stamina
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

    return false;
  }

  appendTo(container) {
    container.appendChild(this.container);
    this.container.classList.add("player");

    return this;
  }

  update() {
    if (this.keyPressed.left) {
      this.position.x -= 5;
    } else if (this.keyPressed.right) {
      this.position.x += 5;
    }

    if (this.keyPressed.up) {
      this.position.y -= 5;
    } else if (this.keyPressed.down) {
      this.position.y += 5;
    }

    this.container.style.left = `${this.position.x}px`;
    this.container.style.top = `${this.position.y}px`;
  }

  render() {
    if (
      this.keyPressed.up ||
      this.keyPressed.down ||
      this.keyPressed.left ||
      this.keyPressed.right
    ) {
      this.container.classList.contains("walk") ||
        this.container.classList.add("walk");
    } else {
      this.container.classList.contains("walk") &&
        this.container.classList.remove("walk");
    }

    if (this.keyPressed.left && !this.container.classList.contains("inverse")) {
      this.container.classList.add("inverse");
    }
    if (this.keyPressed.right && this.container.classList.contains("inverse")) {
      this.container.classList.remove("inverse");
    }
  }
}
