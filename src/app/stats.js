export default class Stats {
  constructor(player) {
    this.container = document.createElement("div");
    this.player = player;

    this.init();
  }

  initStatContainer(name, icon) {
    const id = `${name}Container`;
    const container = (this[id] = document.createElement("div"));

    container.innerHTML = `
        <span class="icon">${icon}</span>
        <span class="value"></span>
    `;

    this.container.appendChild(container);
  }

  init() {
    this.initStatContainer("rank", "🏅");
    this.initStatContainer("stamina", "🏃‍♂️");
    this.initStatContainer("power", "🏋️‍♀️");
    this.initStatContainer("money", "💰");
    this.initStatContainer("level", "💡");
  }

  appendTo(container) {
    container.appendChild(this.container);
    this.container.classList.add("stats");

    return this;
  }

  updateItem(statName, value) {
    const container = this[`${statName}Container`];
    container.querySelector(".value").innerHTML = value;
  }

  update() {
    this.updateItem("rank", this.player.currentStats.rank);
    this.updateItem("stamina", ~~this.player.currentStats.stamina);
    this.updateItem("power", this.player.levelStats.strength);
    this.updateItem("money", this.player.currentStats.money.toFixed(2));
    this.updateItem(
      "level",
      `Level: ${this.player.currentStats.level} | ${this.player.currentStats.experience} XP `
    );
  }

  render() {}
}
