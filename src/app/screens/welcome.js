import "./welcome.less";
import { renderLines, el } from "../helper/text";
import { keyPressed, SPACE } from "../controls";
import { initAudio } from "../audio";
import { destroyNode } from "../helper/node";

export default class WelcomeScreen {
  constructor(game) {
    this.game = game;
    this.container = document.createElement("div");
    this.hostContainer;
    this.s = {
      showSpaceLine: true,
    };

    this.spaceInterval = setInterval(() => {
      this.s.showSpaceLine = !this.s.showSpaceLine;
    }, 400);
  }

  at(container) {
    this.hostContainer = container;
    this.container.classList.add("welcome-screen");

    this.canvas = document.createElement("canvas");

    this.container.appendChild(this.canvas);
    container.appendChild(this.container);

    return this;
  }

  render() {
    if (keyPressed(SPACE) && this.container) {
      clearInterval(this.spaceInterval);
      destroyNode(this.container)
      this.container = undefined;
      initAudio().then(
        () => {
          this.game.start();
        },
        () => {
          this.game.start();
        }
      );
    }

    if (this.container) {
      this.canvas.width = this.hostContainer.clientWidth;
      this.canvas.height = this.hostContainer.clientHeight;

      renderLines(this.canvas, [
        el,
        el,
        el,
        { text: "404", textSize: 28, textAlign: "center" },
        { text: "repetitions", textSize: 28, textAlign: "center" },
        el,
        el,
        el,
        el,
        el,
        el,
        el,
        {
          text: this.s.showSpaceLine ? "Press SPACE to start" : "",
          textAlign: "center",
        },
        {
          text: "The game will ask for access to your audio system!",
          textSize: 8,
          textAlign: "center",
        },
      ]);
    }
  }
}
