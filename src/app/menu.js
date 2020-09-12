import {
  clearCanvas,
  renderText,
  renderTextToCanvas,
  renderLines,
} from "./helper/text";
import "./menu.less";
import { keyPressed, UP, DOWN, SPACE } from "./controls";
import { destroyNode } from "./helper/node";

const INTERACTION_DELAY = 200;

const notHidden = (menuItem) =>
  menuItem.item.hidden === undefined || menuItem.item.hidden === false;

export default class Menu {
  constructor(items, onSelect) {
    this.items = [...items, EXIT_ACTIVITY];
    this.s = {
      selectedItem: this.items.find(notHidden),
      selectedItemIndex: this.items.findIndex(notHidden),
      allowToggle: true,
      allowSelect: false,
    };
    this.container = document.createElement("div");
    this.onSelect = onSelect;

    setTimeout(() => {
      this.s.allowSelect = true;
    }, INTERACTION_DELAY);
  }

  appendTo(container) {
    this.hostContainer = container;
    container.appendChild(this.container);
    this.container.classList.add("menu");

    this.canvas = document.createElement("canvas");
    this.container.appendChild(this.canvas);

    return this;
  }

  update() {
    this.items.forEach((i) => i.update({ selected: false }));
    this.s.selectedItem.update({ selected: true });

    if (this.s.allowToggle && (keyPressed(UP) || keyPressed(DOWN))) {
      this.s.allowToggle = false;
      setTimeout(() => {
        this.s.allowToggle = true;
      }, INTERACTION_DELAY);

      const delta = keyPressed(UP) ? -1 : 1;

      do {
        const newSelectedItemIndex = this.s.selectedItemIndex + delta;
        const sanitizedNewIndex =
          newSelectedItemIndex >= 0
            ? newSelectedItemIndex % this.items.length
            : this.items.length - 1;
        this.s.selectedItemIndex = sanitizedNewIndex;
        this.s.selectedItem = this.items[this.s.selectedItemIndex];
      } while (!notHidden(this.s.selectedItem));
    }

    if (
      this.s.allowSelect &&
      keyPressed(SPACE) &&
      this.s.selectedItem.item.requirementsFulfilled
    ) {
      this.s.allowSelect = this.s.allowToggle = false;
      this.onSelect(this.s.selectedItem.item);
    }

    if (!notHidden(this.s.selectedItem)) {
      this.s.selectedItem = this.items.find(notHidden);
      this.s.selectedItemIndex = this.items.findIndex(notHidden);
    }
  }
  render(player) {
    window.blockMovement = true;
    this.canvas.width = this.hostContainer.clientWidth - 44;
    this.canvas.height = this.items.length * 30 + 60;
    this.container.style.top = `${
      this.hostContainer.clientHeight - 48 - this.canvas.height
    }px`;

    clearCanvas(this.canvas);
    let offsetY = 0;
    this.items.filter(notHidden).forEach((item) => {
      item.render(this.canvas, offsetY, player);
      const delta =
        item === this.s.selectedItem && item !== EXIT_ACTIVITY ? 90 : 30;
      offsetY += delta;
    });
  }

  destroy() {
    window.blockMovement = false;
    destroyNode(this.canvas);
    destroyNode(this.container);
  }

  reset() {
    setTimeout(() => {
      this.s.allowSelect = this.s.allowToggle = true;
    }, INTERACTION_DELAY);
  }
}

export class MenuItem {
  constructor(item) {
    this.item = item;
    this.s = { selected: false };
  }

  update(newState) {
    this.s = { ...this.s, ...newState };
  }

  format(prefix, o) {
    const text = Object.entries(o)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    return `${prefix}: ${text}`;
  }

  getColor() {
    if (this.item.requirementsFulfilled === false) {
      return "red";
    }

    if (this.s.selected) {
      return "black";
    }

    return "grey";
  }

  render(canvas, y, player) {
    const color = this.getColor();
    const titleSuffix =
      this !== EXIT_ACTIVITY && this.item.remainingTime
        ? ` ${this.item.remainingTime} sec`
        : "";
    const title =
      typeof this.item.title === "function"
        ? this.item.title(player)
        : this.item.title;
    const lines = [{ text: `${title}${titleSuffix}`, y, color }];

    if (this !== EXIT_ACTIVITY && this.s.selected) {
      lines.push({
        text: this.format("Requirements", this.item.requirements),
        y: y + 30,
        color,
        textSize: 10,
      });
      lines.push({
        text: this.format("Effect", this.item.effects),
        y: y + 50,
        color,
        textSize: 10,
      });
    }

    renderLines(canvas, lines);
  }
}

export const EXIT_ACTIVITY = new MenuItem({
  title: "Exit venue",
  requirements: { time: 5 },
  effects: {},
});
