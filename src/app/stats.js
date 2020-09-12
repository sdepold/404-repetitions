import { changeableLevelStats } from "./player";
import { renderTextToCanvas, clearAndRenderTextToCanvas } from "./helper/text";

export default class Stats {
  constructor(game) {
    this.containerTop = document.createElement("div");
    this.containerBottom = document.createElement("div");
    this.player = game.player;
    this.time = game.time;

    this.init();
  }

  initStatContainer(name, host) {
    const id = `${name}Container`;
    const container = (this[id] = document.createElement("canvas"));

    container.classList.add(`stat-container`, `stat-container__${name}`);
    host.appendChild(container);
  }

  init() {
    this.initStatContainer("rank", this.containerTop);
    this.initStatContainer("stamina", this.containerTop);
    this.initStatContainer("money", this.containerTop);
    this.initStatContainer("level", this.containerTop);

    this.initStatContainer("time", this.containerBottom);
    this.initStatContainer("level", this.containerBottom);
  }

  appendTo(container) {
    this.hostContainer = container;

    container.appendChild(this.containerTop);
    container.appendChild(this.containerBottom);
    this.containerTop.classList.add("stats", "stats-top");
    this.containerBottom.classList.add("stats", "stats-bottom");

    return this;
  }

  updateItem(statName, value) {
    const canvas = this[`${statName}Container`];
    container.querySelector(".value").innerHTML = value;
  }

  update() {
    this.containerBottom.classList.toggle(
      "hidden",
      this.hostContainer && this.hostContainer.querySelector(".text-overlay")
    );
  }

  render() {
    const statNameMap = {
      level: "lvl",
    };

    ["rank", "stamina", "money", "level"].forEach((statName) => {
      const canvas = this[`${statName}Container`];
      let content = this.player.currentStats[statName];

      if (statName === "stamina") {
        content = ~~this.player.currentStats.stamina;
      } else if (statName === "money") {
        content = content.toFixed(2);
      } else if (statName === "level") {
        content = pad(content);
      }

      clearAndRenderTextToCanvas(
        canvas,
        `${(statNameMap[statName] || statName)}: ${content}`
      );
    });

    const timeString = `Day ${this.time.day} ${pad(this.time.hours)}:${pad(
      this.time.minutes
    )}`;
    const canvas = this.timeContainer;

    clearAndRenderTextToCanvas(canvas, timeString);

    const levelProgress =
      (100.0 * this.player.currentStats.experience) /
      this.player.levelStats.requiredExperience;
    const levelColor = "#FFD700";

    this.containerBottom.style.background = `linear-gradient(to right, ${levelColor}, ${levelColor} ${levelProgress}%, white ${levelProgress}%, white 100%)`;
  }
}

const pad = (num) => (num >= 10 ? num : `0${num}`);
