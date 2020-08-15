import Player from "./player";
import UI from "./ui";

export default class Game {
  constructor() {
    this.player = new Player();
    this.ui = new UI();
    this.time = { day: 0, hours: 0, minutes: 0 };
  }

  increaseTime() {
    this.time.minutes += 90;

    if (this.time.minutes >= 60) {
      this.time.hours += 1;
      this.time.minutes = 0;
    }

    if (this.time.hours >= 24) {
      this.time.day += 1;
      this.time.minutes = this.time.hours = 0;
    }
  }

  run() {
    setInterval(() => {
      console.log(
        `Day ${this.time.day} ${this.time.hours}:${this.time.minutes} --> `,
        this.player
      );
      this.increaseTime();

      this.player.updateStat('stamina', -1);

      this.ui.updateStats(this.player);
      this.ui.updateTime(this.time);
    }, 1000);

    this.ui.updateStats(this.player);
    this.ui.updateTime(this.time);
  }
}
