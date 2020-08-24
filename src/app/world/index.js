import "./style.less";
import Gym from "./gym";
import Home from "./home";

export default class World {
  constructor() {
    this.container = document.createElement("div");
    this.entities = [
      // new Home(),
      // new Gym()
    ];
  }

  appendTo(container) {
    container.appendChild(this.container);
    this.container.classList.add("world");

    this.entities.forEach((e) => e.appendTo(container));

    return this;
  }

  update() {}

  render() {}
}
