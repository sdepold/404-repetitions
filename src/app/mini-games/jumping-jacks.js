import MiniGame from "./mini-game";
import { keyPressed, SPACE } from "../controls";

export default class JumpingJacks extends MiniGame {
  constructor(player) {
    super(player, 'Jumping Jacks');

    this.container.classList.add("jumping-jacks");
    this.s = {
      ...this.s,
      repetitions: 0,
      countdown: 404,
      started: false,
      playerHoisted: false,
      allowJump: undefined,
      yDelta: 0,
    };
  }

  jump() {
    const originalY = this.p.position.y;
    this.s.yDelta = -3;

    setTimeout(() => {
      this.s.yDelta *= -1;

      setTimeout(() => {
        this.s.yDelta = 0;
        this.p.position.y = originalY;
        this.s.allowJump = true;
      }, 200);
    }, 200);
  }

  update() {
    MiniGame.prototype.update.call(this);

    if(this.s.completed) {
      this.onComplete()
      return;
      
    }

    if (this.s.allowJump && this.s.started) {
      this.s.allowJump = false;
      if (Math.random() < 0.1) {
        this.p.container.classList.toggle("inverse");
      }
      this.jump();
    }

    if (this.s.playerHoisted) {
      this.p.position.y += this.s.yDelta;

      if (this.s.allowJump === undefined) {
        this.s.allowJump = true;
      }
    }
  }

  render() {
    MiniGame.prototype.render.call(this);

    if (!this.s.playerHoisted) {
      this.p.container.style.zIndex = 999;
      this.p.position.x = this.hostContainer.clientWidth / 2 - 20;
      this.p.position.y = this.hostContainer.clientHeight / 2 - 20;
      this.s.playerHoisted = true;
    }
  }
}
