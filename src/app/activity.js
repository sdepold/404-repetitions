import gameConfig from "../config/game.json";

export default class Activity {
  constructor(player, config, { onActivityStart, onActivityEnd } = {}) {
    this.container = document.createElement("div");

    this.player = player;
    this.config = config;
    this.state = {
      showItems: false,
      currentItem: null,
      investedTime: null,
    };
    this.onActivityStart = onActivityStart;
    this.onActivityEnd = onActivityEnd;
  }

  hasCurrent() {
    return !!this.state.currentItem;
  }

  appendTo(container) {
    container.appendChild(this.container);
    this.container.classList.add(this.config.name, "activity");

    return this;
  }

  update() {
    if (this.hasCurrent()) {
      this.state.investedTime += gameConfig.minutesPerTick;

      if (this.state.investedTime >= this.state.currentItem.requirements.time) {
        this.state.investedTime = 0;

        Object.keys(this.state.currentItem.effects).forEach((prop) => {
          this.player.updateStat(prop, this.state.currentItem.effects[prop]);
        });

        this.resetCurrent();
      }
    }

    if (this.state.showItems && this.listContainer) {
      this.listContainer.querySelectorAll("li").forEach((li) => {
        const liTitle = li.querySelector(".title").innerText;
        const liItem = this.config.items.find((i) => i.title === liTitle);

        if (this.requirementsFulfilled(liItem.requirements)) {
          li.classList.contains("disabled") && li.classList.remove("disabled");
        } else {
          li.classList.contains("disabled") || li.classList.add("disabled");
        }
      });
    }
  }

  render() {
    this.state.showItems ? this.renderItems() : this.renderHost();
  }

  renderItems() {
    if (!this.listContainer) {
      this.listContainer = document.createElement("ul");
      this.listContainer.classList.add("list");

      this.config.items.forEach((item) => {
        const itemContainer = document.createElement("li");

        itemContainer.addEventListener("click", () => this.onItemClick(item));
        itemContainer.innerHTML = `
            <span class="title">${item.title}</span>
            <span class="earnings">${Object.entries(item.effects)}</span>
            <span class="requirements">${Object.entries(
              item.requirements
            )}</span>
          `;
        this.listContainer.appendChild(itemContainer);
      });
    }

    if (this.hostContainer && this.container.contains(this.hostContainer)) {
      this.container.removeChild(this.hostContainer);
    }

    if (!this.container.contains(this.listContainer)) {
      this.container.appendChild(this.listContainer);
    }

    if (this.hasCurrent()) {
      this.listContainer.querySelectorAll("li").forEach((li) => {
        const liTitle = li.querySelector(".title").innerText;
        if (liTitle === this.state.currentItem.title) {
          li.classList.contains("current") || li.classList.add("current");
        } else {
          li.classList.remove("current");
        }
      });
    }
  }

  renderHost() {
    if (this.listContainer && this.container.contains(this.listContainer)) {
      this.container.removeChild(this.listContainer);
    }

    if (!this.hostContainer) {
      this.hostContainer = document.createElement("div");
      this.hostContainer.classList.add("host");
      this.hostContainer.innerHTML = this.config.host;
      this.hostContainer.addEventListener("click", () => this.toggle());
    }

    if (!this.container.contains(this.hostContainer)) {
      this.container.appendChild(this.hostContainer);
    }
  }

  toggle() {
    this.state.showItems = !this.state.showItems;
  }

  onItemClick(item) {
    if (
      !this.hasCurrent() &&
      !this.findItemContainer(item).classList.contains("disabled")
    ) {
      this.state.currentItem = item;
      this.state.investedTime = 0;
    }
  }

  resetCurrent() {
    this.container.querySelectorAll("li").forEach((li) => {
      li.classList.remove("current");
    });

    this.state.currentItem = null;
    this.state.showItems = false;
  }

  requirementsFulfilled(requirements) {
    return Object.entries(requirements).every(([statName, minValue]) => {
      return this.player.hasStat(statName, minValue);
    });
  }

  findItemContainer(item) {
    return Array.from(this.listContainer.querySelectorAll("li")).find((li) => {
      const liTitle = li.querySelector(".title").innerText;

      return liTitle === item.title;
    });
  }
}
