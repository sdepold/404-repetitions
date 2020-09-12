import "./welcome.less";
import { renderLines } from "../helper/text";

export default class EndScreen {
  constructor(game) {
    this.game = game;
    this.container = document.createElement("div");
  }

  appendTo(container) {
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

    this.game.player.position.x = 180;
    this.game.player.position.y = 350;

    renderLines(this.canvas, [
      { text: "" },
      { text: "" },
      { text: "" },
      { text: "" },
      { text: "Congratulations", textSize: 28, textAlign: "center" },
      { text: "" },
      { text: "you have reached rank 404", textAlign: "center" },
      { text: `in just ${this.game.time.day} days`, textAlign: "center" },
      { text: "" },
      { text: "" },
      { text: "" },
      { text: "Thanks for playing", textAlign: "center" },
      { text: "404 repetitions", textAlign: "center", textSize: 24 },
    ]);
  }
}
