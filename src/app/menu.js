import {
  clearCanvas,
  renderText,
  renderTextToCanvas,
  renderLines,
} from "./helper/text";
import "./menu.less";
import { keyPressed, UP, DOWN, SPACE } from "./controls";

const INTERACTION_DELAY = 200;

const notHidden = (menuItem) =>
  menuItem.item.hidden === undefined || menuItem.item.hidden === false;

export default class Menu {
  constructor(items, onSelect) {
    this.items = [...items, EXIT_ACTIVITY];
    this.state = {
      selectedItem: this.items.find(notHidden),
      selectedItemIndex: this.items.findIndex(notHidden),
      allowToggle: true,
      allowSelect: false,
    };
    this.container = document.createElement("div");
    this.onSelect = onSelect;

    setTimeout(() => {
      this.state.allowSelect = true;
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
    this.state.selectedItem.update({ selected: true });

    if (this.state.allowToggle && (keyPressed(UP) || keyPressed(DOWN))) {
      this.state.allowToggle = false;
      setTimeout(() => {
        this.state.allowToggle = true;
      }, INTERACTION_DELAY);

      const delta = keyPressed(UP) ? -1 : 1;
      const newSelectedItemIndex = this.state.selectedItemIndex + delta;
      const sanitizedNewIndex =
        newSelectedItemIndex >= 0
          ? newSelectedItemIndex % this.items.length
          : this.items.length - 1;
      this.state.selectedItemIndex = sanitizedNewIndex;
      this.state.selectedItem = this.items[this.state.selectedItemIndex];
    }

    if (this.state.allowSelect && keyPressed(SPACE) && this.state.selectedItem.item.requirementsFulfilled) {
      this.state.allowSelect = this.state.allowToggle = false;
      this.onSelect(this.state.selectedItem.item);
    }

    if (!notHidden(this.state.selectedItem)) {
      this.state.selectedItem = this.items.find(notHidden);
      this.state.selectedItemIndex = this.items.findIndex(notHidden);
    }
  }
  render() {
    window.blockMovement = true;
    this.canvas.width = this.hostContainer.clientWidth - 44;
    this.canvas.height = this.items.length * 30 + 60;

    clearCanvas(this.canvas);
    let offsetY = 0;

    this.items.filter(notHidden).forEach((item) => {
      item.render(this.canvas, offsetY);
      const delta =
        item === this.state.selectedItem && item !== EXIT_ACTIVITY ? 90 : 30;
      offsetY += delta;
    });
  }

  destroy() {
    window.blockMovement = false;
    this.container.removeChild(this.canvas);
    this.hostContainer.removeChild(this.container);
  }

  reset() {
    setTimeout(() => {
      this.state.allowSelect = this.state.allowToggle = true;
    }, INTERACTION_DELAY);
  }
}

export class MenuItem {
  constructor(item) {
    this.item = item;
    this.state = { selected: false };
  }

  update(newState) {
    this.state = { ...this.state, ...newState };
  }

  format(prefix, o) {
    const text = Object.entries(o)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ")
      .toUpperCase();
    return `${prefix}: ${text}`;
  }

  getColor() {
    if (this.item.requirementsFulfilled === false) {
      return "red";
    }

    if (this.state.selected) {
      return "black";
    }

    return "grey";
  }

  render(canvas, y) {
    const color = this.getColor();
    const titleSuffix =
      this !== EXIT_ACTIVITY && this.item.remainingTime
        ? ` ${this.item.remainingTime} sec`
        : "";
    const lines = [
      { text: `${this.item.title}${titleSuffix}`.toUpperCase(), y, color },
    ];

    if (this !== EXIT_ACTIVITY && this.state.selected) {
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