import "./welcome.less";
import { renderLines, el } from "../helper/text";

export default class EndScreen {
  constructor(game) {
    this.game = game;
    this.container = document.createElement("div");
  }

  at(container) {
    this.hostContainer = container;
    this.container.classList.add("end-screen");
    this.canvas = document.createElement("canvas");

    this.container.appendChild(this.canvas);
    container.appendChild(this.container);

    return this;
  }

  render() {
    this.canvas.width = this.hostContainer.clientWidth;
    this.canvas.height = this.hostContainer.clientHeight;

    this.game.p.position.x = 180;
    this.game.p.position.y = 350;

    renderLines(this.canvas, [
      el,
      el,
      el,
      el,
      { text: "Congratulations", textSize: 28, textAlign: "center" },
      el,
      { text: "you have reached rank 404", textAlign: "center" },
      { text: `in just ${this.game.time.day} days`, textAlign: "center" },
      el,
      el,
      el,
      { text: "Thanks for playing", textAlign: "center" },
      { text: "404 repetitions", textAlign: "center", textSize: 24 },
    ]);
  }
}
