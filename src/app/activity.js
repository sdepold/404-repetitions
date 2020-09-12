import gameConfig from "../config/game.json";
import { collides } from "./helper/collision-detection";
import { renderText, destroyText } from "./helper/text";
import { nakedComplaint } from "./story";
import { keyPressed, SPACE } from "./controls";
import Menu, { MenuItem, EXIT_ACTIVITY } from "./menu";
import JumpingJacks from "./mini-games/jumping-jacks";
import { pa } from "./audio";

export const TOGGLE_THRESHOLD = 500;

export default class Activity {
  constructor(game, config = {}) {
    this.container = document.createElement("div");

    this.game = game;
    this.p = game.p;
    this.config = config;
    this.s = {
      showItems: false,
      currentItem: null,
      investedTime: null,
      highlight: false,
      toggledViaKeyboardAt: new Date(),
    };
  }

  hasCurrent() {
    return !!this.s.currentItem;
  }

  appendTo(container) {
    this.gameContainer = container;
    container.appendChild(this.container);
    this.container.classList.add(this.config.name, "activity");

    return this;
  }

  applyItemEffects(item) {
    Object.keys(item.effects).forEach((prop) => {
      this.p.updateStat(prop, item.effects[prop]);
    });
  }

  update() {
    if (this.hasCurrent()) {
      this.s.investedTime += gameConfig.minutesPerTick;
      this.s.currentItem.remainingTime =
        this.s.currentItem.requirements.time - this.s.investedTime;

      if (this.s.investedTime >= this.s.currentItem.requirements.time) {
        this.s.investedTime = 0;
        delete this.s.currentItem.remainingTime;

        this.applyItemEffects(this.s.currentItem);
        this.resetCurrent();
      }
    }

    if (this.s.showItems && this.itemMenu) {
      this.itemMenu.items.forEach((menuItem) => {
        menuItem.item.requirementsFulfilled = this.requirementsFulfilled(
          menuItem.item.requirements
        );
        menuItem.item.hidden =
          !menuItem.item.requirementsFulfilled &&
          !!menuItem.item.hideIfRequirementsNotMet;
      });
      this.itemMenu.update();
    }

    if (this.hostContainer) {
      this.s.highlight = collides(
        this.p.container,
        this.hostContainer
      );

      if (
        this.s.highlight &&
        keyPressed(SPACE) &&
        this.canBeToggledViaKeyboard() &&
        !this.s.currentItem
      ) {
        if (this.config.name !== "home" && !this.p.s.dressed) {
          nakedComplaint();
        } else {
          this.toggle();
          this.s.toggledViaKeyboardAt = new Date();
        }
      } else if (!this.s.highlight) {
        this.toggle(false);
      }

      if (this.s.highlight && !this.s.textContainer) {
        this.s.textContainer = renderText(
          `${this.config.name} - press space to open`
        );
      }

      if (!this.s.highlight && this.s.textContainer) {
        this.s.textContainer = destroyText(this.s.textContainer);
      }
    }
  }

  render() {
    if (this.requirementsFulfilled(this.config.requirements || {})) {
      this.renderHost();
      this.s.showItems && this.renderItems();
    }
  }

  renderItems() {
    if (!this.itemMenu) {
      this.itemMenu = new Menu(
        this.config.items.map((i) => new MenuItem(i)),
        (item) => this.onItemSelect(item)
      ).appendTo(this.gameContainer);
    }

    this.itemMenu.render(this.p);
  }

  renderHost() {
    if (!this.hostContainer) {
      this.hostContainer = document.createElement("div");
      this.hostContainer.classList.add("host");
    }

    if (!this.container.contains(this.hostContainer)) {
      this.container.appendChild(this.hostContainer);
    }

    this.hostContainer.classList.toggle("highlight", this.s.highlight);
  }

  toggle(force) {
    if (force !== undefined) {
      this.s.showItems = force;
    } else {
      this.s.showItems = !this.s.showItems;
    }
  }

  canBeToggledViaKeyboard() {
    return new Date() - this.s.toggledViaKeyboardAt > TOGGLE_THRESHOLD;
  }

  onItemSelect(item) {
    if (item.miniGame) {
      setTimeout(() => this.resetCurrent());
      this.game.r.push(
        new JumpingJacks(this.p)
          .appendTo(this.game.ui.game)
          .onComplete((miniGame) => {
            this.game.rr(miniGame);
            this.applyItemEffects(item);
            this.resetCurrent();
          })
      );
      return;
    }

    this.s.currentItem = item;
    this.s.investedTime = 0;

    if (item.soundEffect) {
      pa(item.soundEffect);
    }
  }

  resetCurrent() {
    this.itemMenu && this.itemMenu.destroy();
    this.s.currentItem = null;
    this.toggle(false);
    this.itemMenu = undefined;
  }

  requirementsFulfilled(requirements) {
    return Object.entries(requirements).every(([statName, minValue]) =>
      this.p.hasStat(statName, minValue)
    );
  }

  findItemContainer(item) {
    return Array.from(this.itemMenu.querySelectorAll("li")).find(
      (li) => li.querySelector(".title").innerText === item.title
    );
  }
}
