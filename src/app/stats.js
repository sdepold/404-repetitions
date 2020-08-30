import { changeableLevelStats } from "./player";
import { renderTextToCanvas } from "./helper/text";

export default class Stats {
  constructor(player) {
    this.container = document.createElement("div");
    this.player = player;

    this.init();
  }

  initStatContainer(name, icon) {
    const id = `${name}Container`;
    const container = (this[id] = document.createElement("canvas"));

    container.classList.add(`stat-container`, `stat-container__${name}`);
    this.container.appendChild(container);

    // container.innerHTML = `
    //     <span class="icon">${icon}</span>
    //     <span class="value"></span>
    // `;
  }

  init() {
    this.initStatContainer("rank", "🏅");
    this.initStatContainer("stamina", "🏃‍♂️");
    this.initStatContainer("money", "💰");
    this.initStatContainer("level", "💡");

    // this.levelStatContainer = document.createElement("ul");

    // changeableLevelStats.forEach((stat) => {
    //   const container = document.createElement("li");

    //   container.statName = stat;
    //   container.innerHTML = `
    //         <span class="stat-name">${stat}</span>
    //         <span class="stat-value">${this.player.levelStats[stat]}</span>
    //         <span class="stat-action"></span>
    //     `;

    //   this.levelStatContainer.appendChild(container);
    // });

    // this.container.appendChild(this.levelStatContainer);
  }

  appendTo(container) {
    container.appendChild(this.container);
    this.container.classList.add("stats");

    return this;
  }

  updateItem(statName, value) {
    const canvas = this[`${statName}Container`];
    render;
    container.querySelector(".value").innerHTML = value;
  }

  update() {
    // this.updateItem("rank", this.player.currentStats.rank);
    // this.updateItem("stamina", ~~this.player.currentStats.stamina);
    // this.updateItem("power", this.player.levelStats.strength);
    // this.updateItem("money", this.player.currentStats.money.toFixed(2));
    // this.updateItem(
    //   "level",
    //   `Level: ${this.player.currentStats.level} | ${this.player.currentStats.experience} XP `
    // );
    // Array.from(this.levelStatContainer.querySelectorAll("li")).forEach((li) => {
    //   const valueSpan = li.querySelector(".stat-value");
    //   const actionSpan = li.querySelector(".stat-action");
    //   valueSpan.innerHTML = this.player.levelStats[li.statName];
    //   if (this.player.currentStats.availableStatPoints > 0) {
    //     if (!actionSpan.querySelector(".increase-button")) {
    //       const increaseButton = document.createElement("button");
    //       increaseButton.classList.add("increase-button");
    //       increaseButton.innerText = "+";
    //       actionSpan.appendChild(increaseButton);
    //       increaseButton.addEventListener("click", () => {
    //         this.player.updateLevelStat(li.statName, 1);
    //       });
    //     }
    //   } else {
    //     const increaseButton = actionSpan.querySelector(".increase-button");
    //     increaseButton && actionSpan.removeChild(increaseButton);
    //   }
    // });
  }

  render() {
    ["rank", "stamina", "money"].forEach((statName) => {
      const canvas = this[`${statName}Container`];
      let content = this.player.currentStats[statName];

      if (statName === "stamina") {
        content = ~~this.player.currentStats.stamina;
      } else if (statName === "money") {
        content = content.toFixed(2);
      }

      renderTextToCanvas(canvas, `${statName.toUpperCase()}: ${content}`);
    });
  }
}
