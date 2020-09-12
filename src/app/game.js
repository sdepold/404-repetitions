import Player from "./player";
import UI from "./ui";
import Activity from "./activity";

import competitionConfig from "../config/competition.json";
import foodConfig from "../config/food.json";
import gameConfig from "../config/game.json";
import homeConfig from "../config/home";
import workConfig from "../config/work.json";
import workoutConfig from "../config/workout.json";
import Stats from "./stats";
import World from "./world";
import { renderText } from "./helper/text";
import { initDialog } from "./story";
import WelcomeScreen from "./screens/welcome";
import Menu, { MenuItem } from "./menu";
import MiniGame from "./mini-games/mini-game";
import JumpingJacks from "./mini-games/jumping-jacks";
import EndScreen from "./screens/end";

export default class Game {
  constructor() {
    this.p = new Player();
    this.ui = new UI();
    this.time = { day: 0, hours: 0, minutes: 0 };
    this.s = {
      busy: false,
      renderWorkMenu: false,
      renderWorkoutMenu: false,
      started: false,
      finished: false,
    };
    this.r = [
      new World().appendTo(this.ui.game),
      new Stats(this).appendTo(this.ui.game),
      new Activity(this, competitionConfig).appendTo(this.ui.game),
      new Activity(this, foodConfig).appendTo(this.ui.game),
      new Activity(this, homeConfig).appendTo(this.ui.game),
      new Activity(this, workConfig).appendTo(this.ui.game),
      new Activity(this, workoutConfig).appendTo(this.ui.game),
      this.p.appendTo(this.ui.game),
      new WelcomeScreen(this).appendTo(this.ui.game),
    ];
  }

  rr(_r) {
    this.r = this.r.filter((r) => r !== _r);
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
      if (this.s.started) {
        this.increaseTime();

        if (
          !this.r.find(
            (activity) => activity.hasCurrent && activity.hasCurrent()
          )
        ) {
          this.p.updateStat("stamina", -gameConfig.staminaPerTick);
        }
      }

      if (!this.s.finished && this.p.currentStats.rank <= 404) {
        window.blockMovement = this.s.finished = true;
        this.p.currentStats.rank = 404;
        this.r.push(new EndScreen(this).appendTo(this.ui.game));
      }

      this.r.forEach((a) => a.update && a.update());
      this.r.forEach((a) => a.render && a.render());
    }, gameConfig.tickDelay);
  }

  start() {
    this.s.started = true;
    initDialog(this.p);
  }
}
