import "./welcome.less";
import { renderText, renderLines } from "../helper/text";

export default class WelcomeScreen {
  constructor(game) {
    this.game = game;
    this.container = document.createElement("div");
    this.hostContainer;
    this.state = {
      showSpaceLine: true,
    };

    this.spaceInterval = setInterval(() => {
      this.state.showSpaceLine = !this.state.showSpaceLine;
    }, 400);
  }

  appendTo(container) {
    this.hostContainer = container;
    this.container.classList.add("welcome-screen");

    this.canvas = document.createElement("canvas");

    this.container.appendChild(this.canvas);
    container.appendChild(this.container);

    return this;
  }

  update() {}

  render() {
    if (this.game.player.keyPressed.space && this.container) {
      clearInterval(this.spaceInterval);
      this.hostContainer.removeChild(this.container);
      this.container = undefined;
      this.game.start();
    }

    if (this.container) {
      this.canvas.width = this.hostContainer.clientWidth;
      this.canvas.height = this.hostContainer.clientHeight;

      renderLines(this.canvas, [
        { text: "" },
        { text: "" },
        { text: "" },
        { text: "404", textSize: 28, textAlign: "center" },
        { text: "repetitions", textSize: 28, textAlign: "center" },
        { text: "" },
        { text: "" },
        { text: "" },
        { text: "" },
        { text: "" },
        { text: "" },
        { text: "" },
        { text: "" },
        {
          text: this.state.showSpaceLine ? "Press SPACE to start" : "",
          textAlign: "center",
        },
      ]);
    }
  }
}
