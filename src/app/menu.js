import {
  clearCanvas,
  renderText,
  renderTextToCanvas,
  renderLines,
} from "./helper/text";
import "./menu.less";
import { keyPressed, UP, DOWN, SPACE } from "./controls";

const INTERACTION_DELAY = 200;

export default class Menu {
  constructor(items, onSelect) {
    this.items = items;
    this.state = {
      selectedItem: items[0],
      selectedItemIndex: 0,
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

    if (this.state.allowSelect && keyPressed(SPACE)) {
      this.state.allowSelect = this.state.allowToggle = false;
      this.onSelect(this.state.selectedItem);
    }
  }
  render() {
    window.blockMovement = true;
    this.canvas.width = this.hostContainer.clientWidth - 44;
    this.canvas.height = 160;

    clearCanvas(this.canvas);
    let offsetY = 0;

    this.items.forEach((i, index) => {
      i.render(this.canvas, offsetY);
      offsetY += i === this.state.selectedItem ? 90 : 30;
    });
  }

  destroy() {
    window.blockMovement = false;
    this.container.removeChild(this.canvas);
    this.hostContainer.removeChild(this.container);
  }

  reset() {
    this.state.allowSelect = this.state.allowToggle = true;
  }
}

export class MenuItem {
  constructor({ title, requirements, effects }) {
    this.title = title;
    this.requirements = requirements;
    this.effects = effects;
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

  render(canvas, y) {
    const color = this.state.selected ? "black" : "grey";
    const titleSuffix = this.remainingTime ? ` ${this.remainingTime} sec` : "";
    const lines = [
      { text: `${this.title}${titleSuffix}`.toUpperCase(), y, color },
    ];

    if (this.state.selected) {
      lines.push({
        text: this.format("Requirements", this.requirements),
        y: y + 30,
        color,
        textSize: 10,
      });
      lines.push({
        text: this.format("Effect", this.effects),
        y: y + 50,
        color,
        textSize: 10,
      });
    }

    renderLines(canvas, lines);
  }
}
