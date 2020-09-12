import { clearAndRenderTextToCanvas } from "./helper/text";

export default class Stats {
  constructor(game) {
    this.ct = document.createElement("div");
    this.cb = document.createElement("div");
    this.p = game.p;
    this.t = game.time;

    this.init();
  }

  isc(name, host) {
    const id = `${name}Container`;
    const container = (this[id] = document.createElement("canvas"));

    container.classList.add(`stat-container`, `stat-container__${name}`);
    host.appendChild(container);
  }

  init() {
    this.isc("rank", this.ct);
    this.isc("stamina", this.ct);
    this.isc("money", this.ct);
    this.isc("level", this.ct);

    this.isc("time", this.cb);
    this.isc("level", this.cb);
  }

  at(container) {
    this.hostContainer = container;

    container.appendChild(this.ct);
    container.appendChild(this.cb);
    this.ct.classList.add("stats", "stats-top");
    this.cb.classList.add("stats", "stats-bottom");

    return this;
  }

  update() {
    this.cb.classList.toggle(
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
      let content = this.p.currentStats[statName];

      if (statName === "stamina") {
        content = ~~this.p.currentStats.stamina;
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

    const timeString = `Day ${this.t.day} ${pad(this.t.hours)}:${pad(
      this.t.minutes
    )}`;
    const canvas = this.timeContainer;

    clearAndRenderTextToCanvas(canvas, timeString);

    const levelProgress =
      (100.0 * this.p.currentStats.experience) /
      this.p.levelStats.requiredExperience;
    const levelColor = "#FFD700";

    this.cb.style.background = `linear-gradient(to right, ${levelColor}, ${levelColor} ${levelProgress}%, white ${levelProgress}%, white 100%)`;
  }
}

const pad = (num) => (num >= 10 ? num : `0${num}`);
