import Ground from './ground';
export default class World {
  constructor() {
    this.container = document.createElement("div");
    this.entities = [
      new Ground()
    ];
  }

  appendTo(container) {
    container.appendChild(this.container);
    this.container.classList.add("world");

    this.entities.forEach((e) => e.appendTo(this.container));

    return this;
  }
}
