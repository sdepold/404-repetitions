import "./home.less";

export default class Home {
  constructor() {
    this.container = document.createElement("div");
  }

  appendTo(container) {
    container.appendChild(this.container);
    this.container.classList.add("home");

    this.container.innerHTML = `
      <div class="front">
        <div class="wall"></div>
      </div>
    `;

    return this;
  }

  update() {}

  render() {}
}
