import Player from "./player";
import UI from "./ui";
import Activity from "./activity";

import gameConfig from "../config/game.json";
import foodConfig from '../config/food.json';
import homeConfig from "../config/home.json";
import workConfig from "../config/work.json";
import workoutConfig from "../config/workout.json";

export default class Game {
  constructor() {
    this.player = new Player();
    this.ui = new UI();
    this.time = { day: 0, hours: 0, minutes: 0 };
    this.state = {
      busy: false,
      renderWorkMenu: false,
      renderWorkoutMenu: false,
    };
    this.activities = {
      food: new Activity(foodConfig).appendTo(this.ui.game),
      home: new Activity(homeConfig).appendTo(this.ui.game),
      work: new Activity(workConfig).appendTo(this.ui.game),
      workout: new Activity(workoutConfig).appendTo(this.ui.game),
    };
  }

  increaseTime() {
    this.time.minutes += gameConfig.minutesPerTick;

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
      this.increaseTime();

      if (
        !Object.values(this.activities).find((activity) =>
          activity.hasCurrent()
        )
      ) {
        this.player.updateStat("stamina", -gameConfig.staminaPerTick);
      }

      this.ui.updateStats(this.player);
      this.ui.updateTime(this.time);

      Object.values(this.activities).forEach((a) => a.update(this.player));
      Object.values(this.activities).forEach((a) => a.render());
    }, gameConfig.tickDelay);

    this.ui.updateStats(this.player);
    this.ui.updateTime(this.time);
  }
}
