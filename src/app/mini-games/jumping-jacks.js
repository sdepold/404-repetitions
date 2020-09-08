import MiniGame from "./mini-game";
import { keyPressed, SPACE } from "../controls";

export default class JumpingJacks extends MiniGame {
  constructor(player) {
    super(player);

    this.container.classList.add("jumping-jacks");
    this.state = {
      ...this.state,
      repetitions: 0,
      countdown: 404,
      started: false,
      playerHoisted: false,
      allowJump: undefined,
      yDelta: 0,
    };
  }

  jump() {
    const originalY = this.player.position.y;
    this.state.yDelta = -3;

    setTimeout(() => {
      this.state.yDelta *= -1;

      setTimeout(() => {
        this.state.yDelta = 0;
        this.player.position.y = originalY;
        this.state.allowJump = true;
      }, 200);
    }, 200);
  }

  update() {
    MiniGame.prototype.update.call(this);

    if (this.state.allowJump) {
      this.state.allowJump = false;
      if (Math.random() < 0.1) {
        this.player.container.classList.toggle("inverse");
      }
      this.jump();
    }

    if (this.state.playerHoisted) {
      this.player.position.y += this.state.yDelta;

      if (this.state.allowJump === undefined) {
        this.state.allowJump = true;
      }
    }
  }

  render() {
    MiniGame.prototype.render.call(this);

    if (!this.state.playerHoisted) {
      this.player.container.style.zIndex = 999;
      this.player.position.x = this.hostContainer.clientWidth / 2 - 20;
      this.player.position.y = this.hostContainer.clientHeight / 2 - 20;
      this.state.playerHoisted = true;
    }
  }
}
