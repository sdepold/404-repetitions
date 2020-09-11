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
  constructor(game, config, { onActivityStart, onActivityEnd } = {}) {
    this.container = document.createElement("div");

    this.game = game;
    this.player = game.player;
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
    this.gameContainer = container;
    container.appendChild(this.container);
    this.container.classList.add(this.config.name, "activity");

    return this;
  }

  applyItemEffects(item) {
    Object.keys(item.effects).forEach((prop) => {
      this.player.updateStat(prop, item.effects[prop]);
    });
  }

  update() {
    if (this.hasCurrent()) {
      this.state.investedTime += gameConfig.minutesPerTick;
      this.state.currentItem.remainingTime =
        this.state.currentItem.requirements.time - this.state.investedTime;

      if (this.state.investedTime >= this.state.currentItem.requirements.time) {
        this.state.investedTime = 0;
        delete this.state.currentItem.remainingTime;

        this.applyItemEffects(this.state.currentItem);
        this.resetCurrent();
      }
    }

    if (this.state.showItems && this.itemMenu) {
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
      this.state.highlight = collides(
        this.player.container,
        this.hostContainer
      );

      if (
        this.state.highlight &&
        keyPressed(SPACE) &&
        this.canBeToggledViaKeyboard() &&
        !this.state.currentItem
      ) {
        if (this.config.name !== "home" && !this.player.state.dressed) {
          nakedComplaint();
        } else {
          this.toggle();
          this.state.toggledViaKeyboardAt = new Date();
        }
      } else if (!this.state.highlight) {
        this.toggle(false);
      }

      if (this.state.highlight && !this.state.textContainer) {
        this.state.textContainer = renderText(
          `${this.config.name} - press space to open`
        );
      }

      if (!this.state.highlight && this.state.textContainer) {
        this.state.textContainer = destroyText(this.state.textContainer);
      }
    }
  }

  render() {
    if (this.requirementsFulfilled(this.config.requirements || {})) {
      this.renderHost();
      this.state.showItems && this.renderItems();
    }
  }

  renderItems() {
    if (!this.itemMenu) {
      this.itemMenu = new Menu(
        this.config.items.map((i) => new MenuItem(i)),
        (item) => this.onItemSelect(item)
      ).appendTo(this.gameContainer);
    }

    this.itemMenu.render(this.player);
  }

  renderHost() {
    if (!this.hostContainer) {
      this.hostContainer = document.createElement("div");
      this.hostContainer.classList.add("host");
      this.hostContainer.innerHTML = this.config.host;
    }

    if (!this.container.contains(this.hostContainer)) {
      this.container.appendChild(this.hostContainer);
    }

    this.hostContainer.classList.toggle("highlight", this.state.highlight);
  }

  toggle(force) {
    if (force !== undefined) {
      this.state.showItems = force;
    } else {
      this.state.showItems = !this.state.showItems;
    }
  }

  canBeToggledViaKeyboard() {
    return new Date() - this.state.toggledViaKeyboardAt > TOGGLE_THRESHOLD;
  }

  onItemSelect(item) {
    if (item.miniGame) {
      setTimeout(() => this.resetCurrent());
      this.game.renderables.push(
        new JumpingJacks(this.player)
          .appendTo(this.game.ui.game)
          .onComplete((miniGame) => {
            this.game.removeRenderable(miniGame);
            this.applyItemEffects(item);
            this.resetCurrent();
          })
      );
      return;
    }

    this.state.currentItem = item;
    this.state.investedTime = 0;

    if (item.soundEffect) {
      pa(item.soundEffect);
    }
  }

  resetCurrent() {
    this.itemMenu.destroy();
    this.state.currentItem = null;
    this.toggle(false);
    this.itemMenu = undefined;
  }

  requirementsFulfilled(requirements) {
    return Object.entries(requirements).every(([statName, minValue]) =>
      this.player.hasStat(statName, minValue)
    );
  }

  findItemContainer(item) {
    return Array.from(this.itemMenu.querySelectorAll("li")).find(
      (li) => li.querySelector(".title").innerText === item.title
    );
  }
}
