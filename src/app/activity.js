import gameConfig from "../config/game.json";
import { collides } from "./helper/collision-detection";
import { renderText, destroyText } from "./helper/text";
import { nakedComplaint } from "./story";

export const TOGGLE_THRESHOLD = 500;

export default class Activity {
  constructor(player, config, { onActivityStart, onActivityEnd } = {}) {
    this.container = document.createElement("div");

    this.player = player;
    this.config = config;
    this.state = {
      showItems: false,
      currentItem: null,
      investedTime: null,
      highlight: false,
      toggledViaKeyboardAt: new Date(),
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
        const requirementsFulfilled = this.requirementsFulfilled(
          liItem.requirements
        );

        li.classList.toggle("disabled", !requirementsFulfilled);
        li.classList.toggle(
          "hidden",
          !requirementsFulfilled && !!liItem.hideIfRequirementsNotMet
        );
      });
    }

    if (this.hostContainer) {
      this.state.highlight = collides(
        this.player.container,
        this.hostContainer
      );

      if (
        this.state.highlight &&
        this.player.keyPressed.space &&
        this.canBeToggledViaKeyboard()
      ) {
        if(this.config.name !== 'home' && !this.player.state.dressed) {
          nakedComplaint();
        } else {
          this.toggle();
          this.state.toggledViaKeyboardAt = new Date();
        }
      } else if (!this.state.highlight) {
        this.toggle(false);
      }

      if (this.state.highlight && !this.state.textContainer) {
        this.state.textContainer = renderText(`${this.config.name} - press space to open`);
      }

      if (!this.state.highlight && this.state.textContainer) {
        this.state.textContainer = destroyText(this.state.textContainer);
      }
    }
  }

  render() {
    if (this.requirementsFulfilled(this.config.requirements || {})) {
      this.renderHost();
      this.renderItems();
    }
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

    if (!this.container.contains(this.listContainer)) {
      this.container.appendChild(this.listContainer);
    }

    if (this.hasCurrent()) {
      this.listContainer.querySelectorAll("li").forEach((li) => {
        const liTitle = li.querySelector(".title").innerText;
        li.classList.toggle(
          "current",
          liTitle === this.state.currentItem.title
        );
      });
    }

    this.listContainer.classList.toggle("hidden", !this.state.showItems);
  }

  renderHost() {
    if (!this.hostContainer) {
      this.hostContainer = document.createElement("div");
      this.hostContainer.classList.add("host");
      this.hostContainer.innerHTML = this.config.host;
      this.hostContainer.addEventListener("click", () => this.toggle());
    }

    if (!this.container.contains(this.hostContainer)) {
      this.container.appendChild(this.hostContainer);
    }

    this.hostContainer.classList.toggle("highlight", this.state.highlight);
  }

  toggle(force) {
    if (force !== undefined) {
      return (this.state.showItems = force);
    }

    this.state.showItems = !this.state.showItems;
  }

  canBeToggledViaKeyboard() {
    return new Date() - this.state.toggledViaKeyboardAt > TOGGLE_THRESHOLD;
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
    this.toggle(false);
  }

  requirementsFulfilled(requirements) {
    return Object.entries(requirements).every(([statName, minValue]) =>
      this.player.hasStat(statName, minValue)
    );
  }

  findItemContainer(item) {
    return Array.from(this.listContainer.querySelectorAll("li")).find(
      (li) => li.querySelector(".title").innerText === item.title
    );
  }
}
